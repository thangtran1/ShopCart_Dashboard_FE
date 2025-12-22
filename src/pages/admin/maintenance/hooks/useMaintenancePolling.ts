import { useEffect, useRef } from "react";
import { Maintenance, maintenanceApi, MaintenanceStatus } from "@/api/services/maintenanceApi";

export function useMaintenancePolling(onStatusChange: () => void) {
  const timeoutRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const scheduleStatusCheck = (maintenance: Maintenance) => {
    const now = new Date().getTime();
    const startTime = new Date(maintenance.startTime).getTime();
    const endTime = new Date(maintenance.endTime).getTime();

    // Xóa timeout cũ nếu có
    if (timeoutRefs.current[maintenance._id]) {
      clearTimeout(timeoutRefs.current[maintenance._id]);
      delete timeoutRefs.current[maintenance._id];
    }

    // Nếu là bảo trì đã lên lịch và chưa bắt đầu
    if (maintenance.status === MaintenanceStatus.SCHEDULED) {
      if (startTime > now) {
        // Đặt timeout cho thời điểm bắt đầu
        const timeUntilStart = startTime - now;
        timeoutRefs.current[maintenance._id] = setTimeout(() => {
          onStatusChange();
          // Sau khi bắt đầu, đặt timeout cho thời điểm kết thúc
          const timeUntilEnd = endTime - new Date().getTime();
          if (timeUntilEnd > 0) {
            timeoutRefs.current[maintenance._id] = setTimeout(() => {
              onStatusChange();
            }, timeUntilEnd);
          }
        }, timeUntilStart);
      }
    }
    // Nếu đang trong quá trình bảo trì
    else if (maintenance.status === MaintenanceStatus.IN_PROGRESS) {
      if (endTime > now) {
        // Đặt timeout cho thời điểm kết thúc
        const timeUntilEnd = endTime - now;
        timeoutRefs.current[maintenance._id] = setTimeout(() => {
          onStatusChange();
        }, timeUntilEnd);
      }
    }
  };

  const setupMaintenanceTimers = async () => {
    try {
      // Lấy danh sách các bảo trì đã lên lịch
      const scheduledResponse = await maintenanceApi.getList({
        status: MaintenanceStatus.SCHEDULED,
      });

      // Lấy danh sách các bảo trì đang diễn ra
      const inProgressResponse = await maintenanceApi.getList({
        status: MaintenanceStatus.IN_PROGRESS,
      });

      const allMaintenances = [
        ...(scheduledResponse.data.success ? scheduledResponse.data.data : []),
        ...(inProgressResponse.data.success
          ? inProgressResponse.data.data
          : []),
      ];

      allMaintenances.forEach((maintenance) => {
        scheduleStatusCheck(maintenance);
      });
    } catch (error) {
      console.error("Failed to setup maintenance timers:", error);
    }
  };

  // Khởi tạo các timer khi component mount
  useEffect(() => {
    setupMaintenanceTimers();

    // Cleanup khi component unmount
    return () => {
      Object.values(timeoutRefs.current).forEach((timeout) => {
        clearTimeout(timeout);
      });
      timeoutRefs.current = {};
    };
  }, []);

  return {
    setupTimers: setupMaintenanceTimers, // Cho phép thiết lập lại timer khi cần
  };
}
