import { useState } from "react";
import { Button, Modal, Space } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  CloudDownloadOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { databaseAdmin } from "@/api/services/databaseApi";
import dayjs from "dayjs";
import { toast } from "sonner";
import { Icon } from "@/components/icon";
import { useTranslation } from "react-i18next";
import { Separator } from "@/ui/separator";
import TableAntd from "@/components/common/tables/custom-table-antd";
import { Backup } from "@/types/entity";
import CustomConfirmModal from "@/components/common/modals/custom-modal-confirm";

export default function BackupList({
  backups,
  reload,
  loading,
  pagination,
  onPageChange,
}: {
  backups: Backup[];
  reload: () => Promise<void>;
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number, pageSize?: number) => void;
}) {
  const { t } = useTranslation();
  const [viewModal, setViewModal] = useState(false);
  const [viewContent, setViewContent] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);

  const openConfirmModal = (filename: string) => {
    setSelectedBackup(filename);
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedBackup(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBackup) return;

    try {
      const res = await databaseAdmin.deleteBackup(selectedBackup);
      if (res.success) {
        toast.success(res.message);
        await reload();
      } else {
        toast.error(
          res.message || t("management.database.delete-backup-error")
        );
      }
    } catch (e) {
      throw e;
    } finally {
      handleCancel();
    }
  };

  const handleViewBackup = async (filename: string) => {
    try {
      const res = await databaseAdmin.viewBackup(filename);
      if (res.success) {
        setViewContent(JSON.stringify(res.data, null, 2));
        setViewModal(true);
      } else {
        toast.error(t("management.database.view-backup-error"));
      }
    } catch {
      toast.error(t("management.database.view-backup-error"));
    }
  };

  const handleDownloadBackup = async (filename: string) => {
    try {
      const res = await databaseAdmin.downloadBackupJson(filename);
      if (!res.success)
        throw new Error(
          res.message || t("management.database.download-backup-error")
        );

      const { filename: name, content } = res.data;

      // Base64 → Blob
      const byteCharacters = atob(content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/json" });

      // Tạo link download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(res.message);
    } catch (error: any) {
      toast.error(
        error.message || t("management.database.download-backup-error")
      );
    }
  };

  const columns = [
    {
      title: t("management.database.no"),
      key: "no",
      render: (_: any, __: any, index: number) => index + 1,
      width: 100,
      align: "center" as "center",
    },
    {
      title: t("management.database.filename"),
      dataIndex: "filename",
      key: "filename",
    },
    {
      title: t("management.database.created-at"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) =>
        text ? dayjs(text).format("HH:mm:ss DD/MM/YYYY") : "—",
    },
    {
      title: t("management.database.actions"),
      key: "actions",
      align: "center",
      width: 120,
      fixed: "right",
      render: (_: any, record: Backup) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewBackup(record.filename)}
          >
            {t("management.database.view")}
          </Button>
          <Button
            icon={<CloudDownloadOutlined />}
            onClick={() => handleDownloadBackup(record.filename)}
          >
            {t("management.database.download")}
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => openConfirmModal(record.filename)}
          >
            {t("management.database.delete")}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
        <Icon icon="lucide:database" className="h-5 w-5 text-blue-600" />
        {t("management.database.backup-list")}
      </h2>
      <Separator className="my-4" />
      <TableAntd
        columns={columns}
        data={backups}
        loading={loading}
        pagination={pagination}
        onPageChange={onPageChange}
      />
      <CustomConfirmModal
        visible={isModalVisible}
        title={t("management.database.delete-backup-confirm-title")}
        description={t("management.database.delete-backup-confirm-description")}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancel}
        filename={selectedBackup}
      />
      <Modal
        title={
          <span className="text-blue-600 font-semibold flex items-center gap-2">
            <DatabaseOutlined /> {t("management.database.backup-content")}
          </span>
        }
        open={viewModal}
        onCancel={() => setViewModal(false)}
        footer={[
          <Button
            key="close"
            onClick={() => setViewModal(false)}
            type="primary"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {t("management.database.close")}
          </Button>,
        ]}
        width={800}
        centered
        classNames={{ content: "!p-4" }}
        className="rounded-xl"
      >
        <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-sm text-gray-700 dark:text-gray-200 overflow-auto max-h-[500px]">
          {viewContent}
        </pre>
      </Modal>
    </div>
  );
}
