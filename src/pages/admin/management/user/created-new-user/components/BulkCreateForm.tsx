import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
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

  const downloadTemplate = useCallback(async () => {
    const XLSX = await import("xlsx");
    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.json_to_sheet(templateData);
    XLSX.utils.book_append_sheet(wb, ws, "Users");

    const instructionWs = XLSX.utils.json_to_sheet(instructionData);
    XLSX.utils.book_append_sheet(wb, instructionWs, "Hướng dẫn");

    XLSX.writeFile(wb, "user_template.xlsx");
  }, []);

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

  const handleUpload = useCallback(async (file: File) => {
    const XLSX = await import("xlsx");
    setUploading(true);
    setPreviewUsers([]);
    setResult(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array", cellDates: true });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      if (!worksheet) {
        toast.error(t("management.user.cannot-read-sheet"));
        return;
      }

      // Lấy thẳng JSON object (Dòng 1 làm Key)
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      if (jsonData.length === 0) {
        toast.error(t("management.user.no-data-or-only-header"));
        return;
      }

      const previewData: PreviewUser[] = jsonData.map((row: any, index: number) =>
        validateUserData(row, index + 2)
      );

      setPreviewUsers(previewData);
      setStep("preview");
      toast.success(t("management.user.loaded-users-from-file", { count: previewData.length }));
    } catch (error) {
      toast.error(t("management.user.invalid-excel-file"));
    } finally {
      setUploading(false);
    }
  }, [t]);

  const handleCreateUsers = useCallback(async () => {
    const invalidUsers = previewUsers.filter((user) => !user.isValid);
    if (invalidUsers.length > 0) {
      toast.error(t("management.user.cannot-create-users-because-of-errors", { count: invalidUsers.length }));
      return;
    }

    setCreating(true);
    try {
      const XLSX = await import("xlsx");
      const userData = previewUsers.map(({ name, email, password, role, status, phone, bio }) => ({
        name, email, password, role, status, phone: phone || "", bio: bio || ""
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(userData);
      XLSX.utils.book_append_sheet(wb, ws, "Users");

      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const file = new File([excelBuffer], "users.xlsx", { 
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
      });

      const response = await bulkCreateUsers(file);

      if (response.data.success) {
        setResult(response.data.data);
        setStep("result");
        toast.success(t("management.user.bulk-create-success", { count: response.data.data.successCount }));
      } else {
        toast.error(response.data.message || t("management.user.bulk-create-failed"));
      }
    } catch (error) {
      toast.error("Lỗi hệ thống khi xử lý dữ liệu");
    } finally {
      setCreating(false);
    }
  }, [previewUsers, t]);

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
