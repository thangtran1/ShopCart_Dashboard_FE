import { Icon } from "@/components/icon";
import { Tabs, type TabsProps, Skeleton } from "antd";
import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { notificationUserService } from "@/api/services/notificationApi";
import { NotificationType } from "@/types/enum";
import { useTranslation } from "react-i18next";
import { Notification } from "@/types/entity";
import { useUserToken } from "@/store/userStore";

dayjs.extend(relativeTime);
dayjs.locale("vi");

export default function NoticeContent() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { accessToken } = useUserToken();

  const loadNotifications = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const response = await notificationUserService.getAll(1, 15);
      setNotifications(response.data.notifications as Notification[]);
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationUserService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isReadByUser: true } : n))
      );
      toast.success("Đã đánh dấu là đã đọc")
    } catch (error) {
      toast.error("Không thể đánh dấu đọc");
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.isReadByUser).map((n) => n._id);
    if (unreadIds.length === 0) return;

    try {
      await Promise.all(unreadIds.map((id) => notificationUserService.markAsRead(id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, isReadByUser: true })));
      toast.success("Đã đọc tất cả thông báo");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="relative px-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            Trung tâm tin nhắn
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          </h3>
          <button
            onClick={handleMarkAllAsRead}
            className="p-2 rounded-full cursor-pointer hover:bg-white dark:hover:bg-zinc-800 shadow-sm border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all text-zinc-500 hover:text-primary active:scale-90"
            title="Đánh dấu tất cả đã đọc"
          >
            <Icon icon="solar:checklist-minimalistic-bold" size={20} />
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest">
          Bạn có {notifications.filter(n => !n.isReadByUser).length} tin nhắn chưa đọc
        </p>
      </div>

      {/* Tabs Custom Styling */}
      <div className="notice-tabs-container px-2">
        <NoticeTabs
          notifications={notifications}
          loading={loading}
          onMarkAsRead={handleMarkAsRead}
        />
      </div>

      <div className="p-3  border-b border-border">
        <button className="group w-full cursor-pointer py-2.5 px-4  hover:bg-primary border border-border rounded-xl text-xs font-bold transition-all duration-300 shadow-sm flex items-center justify-center gap-2 ">
          Xem tất cả hoạt động
          <Icon icon="solar:alt-arrow-right-linear" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

function NoticeTabs({ notifications, loading, onMarkAsRead }: any) {
  const unreadNotifications = useMemo(() => notifications.filter((n: any) => !n.isReadByUser), [notifications]);

  const items: TabsProps["items"] = [
    {
      key: "all",
      label: <span className="px-2 py-1 italic">Mới nhất</span>,
      children: <NotificationList data={notifications} loading={loading} onMarkAsRead={onMarkAsRead} />,
    },
    {
      key: "unread",
      label: (
        <div className="flex items-center gap-2 px-2">
          <span>Chưa đọc</span>
          {unreadNotifications.length > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full font-black animate-bounce">
              {unreadNotifications.length}
            </span>
          )}
        </div>
      ),
      children: <NotificationList data={unreadNotifications} loading={loading} onMarkAsRead={onMarkAsRead} />,
    },
  ];

  return (
    <Tabs
      defaultActiveKey="all"
      items={items}
      centered
      className="modern-tabs"
      tabBarStyle={{ borderBottom: 'none', marginBottom: '8px' }}
    />
  );
}

function NotificationList({ data, loading, onMarkAsRead }: any) {
  if (loading) return (
    <div className="p-4 space-y-4">
      {[1, 2, 3].map(i => <Skeleton key={i} active avatar paragraph={{ rows: 1 }} />)}
    </div>
  );

  if (data.length === 0) return (
    <div className="py-12 flex flex-col items-center opacity-80">
      <Icon icon="solar:box-minimalistic-linear" size={64} className="mb-2" />
      <span className="text-xs font-bold uppercase tracking-tighter text-muted-foreground">Hộp thư trống</span>
    </div>
  );

  return (
    <div className="overflow-y-auto max-h-[300px] pb-2 space-y-2 custom-scroll">
      {data.map((item: Notification) => (
        <NotificationItem key={item._id} item={item} onMarkAsRead={onMarkAsRead} />
      ))}
    </div>
  );
}

function NotificationItem({ item, onMarkAsRead }: { item: Notification; onMarkAsRead: any }) {
  const isUnread = !item.isReadByUser;

  const getIcon = (type: string) => {
    switch (type) {
      case NotificationType.SYSTEM: return { icon: "solar:shield-check-bold", color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10" };
      case NotificationType.MAINTENANCE: return { icon: "solar:danger-bold", color: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10" };
      default: return { icon: "solar:unread-bold", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" };
    }
  };

  const meta = getIcon(item.type);

  return (
    <div
      onClick={() => isUnread && onMarkAsRead(item._id)}
      className={`group relative flex gap-2 p-2 rounded-2xl transition-all duration-300 border cursor-pointer ${isUnread
        ? "border-border border shadow-md"
        : "bg-transparent border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/50 opacity-80"
        }`}
    >
      <div className="relative flex-shrink-0">
        <div className={`w-12 h-12 rounded-2xl ${meta.bg} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
          <Icon icon={meta.icon} size={24} className={meta.color} />
        </div>
        {isUnread && (
          <div className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white dark:border-zinc-900"></span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-black uppercase tracking-widest ${meta.color}`}>
            {item.type}
          </span>
          <span className="text-[10px] text-muted-foreground font-bold italic">
            {dayjs(item.createdAt).fromNow()}
          </span>
        </div>

        <h4 className={`text-[12px] leading-[1.4] line-clamp-2 ${isUnread ? "font-bold text-muted-foreground" : "font-medium text-zinc-500"}`}>
          {item.content}
        </h4>

        {isUnread && (
          <div className="mt-2 flex items-center gap-1 text-[10px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            Nhấp để đánh dấu đọc <Icon icon="solar:double-alt-arrow-right-bold" size={12} />
          </div>
        )}
      </div>
    </div>
  );
}