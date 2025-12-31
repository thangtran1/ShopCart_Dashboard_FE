import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import * as XLSX from "xlsx";
import { bulkCreateUsers } from "@/api/services/userManagementApi";
import StepIndicator from "./StepIndicator";
import UploadCard from "./UploadCard";
import PreviewCard from "./PreviewCard";
import ResultCard from "./ResultCard";
import { toast } from "sonner";
import { BulkResult, PreviewUser } from "@/types/entity";
import { instructionData, templateData } from "./teamplate_intruction_file";

export default function BulkCreateForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [previewUsers, setPreviewUsers] = useState<PreviewUser[]>([]);
  const [result, setResult] = useState<BulkResult | null>(null);
  const [step, setStep] = useState<"upload" | "preview" | "result">("upload");

  const downloadTemplate = () => {
    // Tạo workbook và worksheet
    const wb = XLSX.utils.book_new();

    // Sheet dữ liệu
    const ws = XLSX.utils.json_to_sheet(templateData);
    XLSX.utils.book_append_sheet(wb, ws, "Users");

    // Sheet hướng dẫn
    const instructionWs = XLSX.utils.json_to_sheet(instructionData);
    XLSX.utils.book_append_sheet(wb, instructionWs, "Hướng dẫn");

    // Tạo file Excel và download
    XLSX.writeFile(wb, "user_template.xlsx");
  };

  const validateUserData = (row: any, rowNumber: number): PreviewUser => {
    // Chuyển đổi tất cả giá trị thành string để tránh lỗi type
    const user: PreviewUser = {
      row: rowNumber,
      name: String(row.name || "").trim(),
      email: String(row.email || "")
        .trim()
        .toLowerCase(),
      password: String(row.password || ""),
      role: String(row.role || "user").toLowerCase(),
      status: String(row.status || "active").toLowerCase(),
      phone: String(row.phone || "").trim(),
      bio: String(row.bio || "").trim(),
      isValid: true,
      error: "",
    };

    // Validate required fields
    if (!user.name || !user.email || !user.password) {
      user.isValid = false;
      user.error = "Thiếu thông tin bắt buộc (name, email, password)";
      return user;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      user.isValid = false;
      user.error = "Email không hợp lệ";
      return user;
    }

    // Validate role
    const validRoles = ["user", "moderator", "admin"];
    if (!validRoles.includes(user.role)) {
      user.isValid = false;
      user.error = `Vai trò không hợp lệ. Chỉ chấp nhận: ${validRoles.join(
        ", "
      )}`;
      return user;
    }

    // Validate status
    const validStatuses = ["active", "inactive"];
    if (!validStatuses.includes(user.status)) {
      user.isValid = false;
      user.error = `Trạng thái không hợp lệ. Chỉ chấp nhận: ${validStatuses.join(
        ", "
      )}`;
      return user;
    }

    // Validate password length
    if (user.password.length < 6) {
      user.isValid = false;
      user.error = "Mật khẩu phải có ít nhất 6 ký tự";
      return user;
    }

    return user;
  };

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      setPreviewUsers([]);
      setResult(null);

      // Đọc file và parse data
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            toast.error(t("management.user.cannot-read-file"));
            setUploading(false);
            return;
          }

          let workbook;
          try {
            workbook = XLSX.read(data, {
              type: "array",
              cellDates: true,
              cellNF: false,
              cellText: false,
            });
          } catch (xlsxError) {
            toast.error(t("management.user.invalid-excel-file"));
            setUploading(false);
            return;
          }

          if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
            toast.error(t("management.user.no-sheet-found"));
            setUploading(false);
            return;
          }

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          if (!worksheet) {
            toast.error(t("management.user.cannot-read-sheet"));
            setUploading(false);
            return;
          }

          let jsonData;
          try {
            jsonData = XLSX.utils.sheet_to_json(worksheet, {
              header: 1, // Đọc dưới dạng array
              defval: "", // Giá trị mặc định cho cell trống
              blankrows: false, // Bỏ qua dòng trống
            });
          } catch (jsonError) {
            toast.error(t("management.user.cannot-convert-data"));
            setUploading(false);
            return;
          }

          if (!jsonData || jsonData.length < 2) {
            // Ít nhất phải có header + 1 dòng data
            toast.error(t("management.user.no-data-or-only-header"));
            setUploading(false);
            return;
          }

          // Lấy header (dòng đầu tiên)
          const headers = jsonData[0] as string[];
          const dataRows = jsonData.slice(1); // Bỏ header

          // Chuyển đổi từ array sang object
          const objectData = dataRows.map((row: unknown) => {
            const rowArray = row as any[];
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = rowArray[index] || "";
            });
            return obj;
          });

          // Validate và tạo preview
          const previewData: PreviewUser[] = objectData.map(
            (row: any, index: number) => {
              const validated = validateUserData(row, index + 2); // +2 vì Excel bắt đầu từ 1 và có header
              return validated;
            }
          );

          if (previewData.length === 0) {
            toast.error(t("management.user.no-valid-data-to-process"));
            setUploading(false);
            return;
          }
          setPreviewUsers(previewData);
          setStep("preview");
          toast.success(
            t("management.user.loaded-users-from-file", {
              count: previewData.length,
            })
          );
        } catch (error) {
          throw error;
        } finally {
          setUploading(false);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error: any) {
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleCreateUsers = async () => {
    // Kiểm tra tất cả user phải hợp lệ
    const invalidUsers = previewUsers.filter((user) => !user.isValid);

    if (invalidUsers.length > 0) {
      toast.error(
        t("management.user.cannot-create-users-because-of-errors", {
          count: invalidUsers.length,
        })
      );
      return;
    }

    if (previewUsers.length === 0) {
      toast.error(t("management.user.no-users-to-create"));
      return;
    }

    try {
      setCreating(true);

      // Tạo file Excel từ tất cả users (vì đã validate hết rồi)
      const userData = previewUsers.map((user) => ({
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        status: user.status,
        phone: user.phone || "",
        bio: user.bio || "",
      }));

      let wb, ws, excelBuffer, blob, file;

      try {
        wb = XLSX.utils.book_new();
        ws = XLSX.utils.json_to_sheet(userData);
        XLSX.utils.book_append_sheet(wb, ws, "Users");

        excelBuffer = XLSX.write(wb, {
          bookType: "xlsx",
          type: "array",
          compression: true,
        });

        blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        file = new File([blob], "users.xlsx", { type: blob.type });
      } catch (excelError) {
        toast.error(t("management.user.error-creating-excel-file"));
        setCreating(false);
        return;
      }

      const response = await bulkCreateUsers(file);

      if (response.data.success) {
        const bulkResult: BulkResult = {
          successCount: response.data.data.successCount,
          errorCount: response.data.data.errorCount,
          errors: response.data.data.errors,
        };

        setResult(bulkResult);
        setStep("result");

        if (bulkResult.successCount > 0) {
          toast.success(
            t("management.user.bulk-create-success", {
              count: bulkResult.successCount,
            })
          );
        }

        if (bulkResult.errorCount > 0) {
          toast.warning(
            t("management.user.bulk-create-partial-success", {
              success: bulkResult.successCount,
              error: bulkResult.errorCount,
            })
          );
        }
      } else {
        toast.error(
          response.data.message || t("management.user.bulk-create-failed")
        );
      }
    } catch (error) {
      throw error;
    } finally {
      setCreating(false);
    }
  };

  const handleReset = () => {
    setStep("upload");
    setPreviewUsers([]);
    setResult(null);
  };

  const handleBackToManagement = () => {
    navigate("/management/user");
  };

  return (
    <div className="space-y-8">
      <StepIndicator currentStep={step} />

      {step === "upload" && (
        <UploadCard
          onUpload={handleUpload}
          onDownloadTemplate={downloadTemplate}
          uploading={uploading}
        />
      )}

      {step === "preview" && (
        <PreviewCard
          users={previewUsers}
          onConfirm={handleCreateUsers}
          onBack={handleReset}
          loading={creating}
        />
      )}

      {step === "result" && result && (
        <ResultCard
          result={result}
          onReset={handleReset}
          onBackToManagement={handleBackToManagement}
        />
      )}
    </div>
  );
}
