import { useState, useEffect } from "react";
import { Typography, Timeline } from "antd";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { toast } from "sonner";
import { ActivityLog } from "@/api/services/activity-logApi";
import PageLoading from "@/components/common/loading/PageLoading";
import { EmptyState } from "@/components/common/EmptyState";

const { Text } = Typography;

interface ActivityLogsProps {
  fetchLogsApi: () => Promise<{
    data: { success: boolean; message: string; data: ActivityLog[] };
  }>;
}

export default function ActivityLogs({ fetchLogsApi }: ActivityLogsProps) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetchLogsApi();
      if (response.data?.success) {
        setLogs(response.data.data);
      } else {
        toast.error("Không thể lấy lịch sử hoạt động");
      }
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      toast.error("Lỗi khi lấy lịch sử hoạt động");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Nhóm logs theo ngày
  const logsGroupedByDate = logs.reduce(
    (acc: Record<string, ActivityLog[]>, log) => {
      const date = dayjs(log.timestamp).format("YYYY-MM-DD");
      if (!acc[date]) acc[date] = [];
      acc[date].push(log);
      return acc;
    },
    {}
  );

  const sortedDates = Object.keys(logsGroupedByDate).sort((a, b) =>
    dayjs(b).diff(dayjs(a))
  );

  if (logs.length === 0) {
    return (
      <EmptyState
        height="sm"
        title="Lịch sử trống"
        description="Chưa có hoạt động nào được ghi lại"
      />
    );
  }

  return (
    <div className="p-4 rounded-xl border border-border">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <PageLoading height={300} text="Đang tải lịch sử..." />
        </div>
      ) : (
        <div className="scrollbar-none max-h-[calc(100dvh-500px)] overflow-y-auto pr-3">
          {sortedDates.map((date) => (
            <div key={date}>
              <div className="!text-base w-fit border border-blue-400 bg-blue-500/20 px-4 py-1 mb-6 rounded-md">
                {dayjs(date).format("DD/MM/YYYY")}
              </div>

              <Timeline
                mode="left"
                items={logsGroupedByDate[date].map((log) => ({
                  dot:
                    log.type === "login" ? (
                      <LoginOutlined
                        style={{ fontSize: 22, color: "#52c41a" }}
                      />
                    ) : (
                      <LogoutOutlined
                        style={{ fontSize: 22, color: "#ff4d4f" }}
                      />
                    ),
                  color: log.type === "login" ? "green" : "red",
                  children: (
                    <div className="ml-3">
                      <div className="flex items-center justify-between">
                        <Text strong className="text-base">
                          {log.type === "login"
                            ? "Đăng nhập hệ thống"
                            : "Đăng xuất hệ thống"}
                        </Text>
                        <Text type="success">
                          {dayjs(log.timestamp).format("HH:mm:ss")}
                        </Text>
                      </div>
                      <p className="text-sm text-foreground mt-1 mb-1">
                        Trình duyệt:{" "}
                        <span className="font-medium text-blue-600">
                          {log.userAgent}
                        </span>
                      </p>
                      <Text type="secondary" className="text-xs">
                        IP:{" "}
                        <span className="text-green-600 font-medium">
                          {log.ip}
                        </span>
                      </Text>
                    </div>
                  ),
                }))}
              />
            </div>
          ))}
          <style>{`
            .ant-timeline-item-tail {
              background-color: #52c41a;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
