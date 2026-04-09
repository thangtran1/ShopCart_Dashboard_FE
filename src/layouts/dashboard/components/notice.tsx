import { Icon } from "@/components/icon";
import { Button } from "@/ui/button";
import { Tabs, type TabsProps, Skeleton, Popover, Badge } from "antd";
import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { notificationUserService, notificationAdminService } from "@/api/services/notificationApi";
import { NotificationType } from "@/types/enum";
import { Notification } from "@/types/entity";
import { useUserToken, useUserInfo } from "@/store/userStore";
import { EmptyState } from "@/components/common/EmptyState";
import { useTranslation } from "react-i18next";
import { io, Socket } from "socket.io-client";
import { useRouter } from "@/router/hooks";

dayjs.extend(relativeTime);
dayjs.locale("vi");

export default function NoticeContent({ onUnreadChange }: { onUnreadChange?: (count: number) => void }) {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { accessToken } = useUserToken();
  const { role } = useUserInfo();

  const loadNotifications = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      if (role === "admin") {
        // Chỉ lấy thông báo đơn hàng cho Admin
        const response = await notificationAdminService.getAll(1, 15, { type: NotificationType.ORDER });
        setNotifications(response.data.notifications as Notification[]);
      } else {
        const response = await notificationUserService.getAll(1, 15);
        const userNotifs = (response.data.notifications as Notification[]).filter(
          (n) => n.type !== NotificationType.ORDER
        );
        setNotifications(userNotifs);
      }
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  }, [accessToken, role]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationUserService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isReadByUser: true } : n))
      );
      toast.success(t("notifications.toast.mark_read_success"));
    } catch (error) {
      toast.error(t("notifications.toast.mark_read_error"));
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications
      .filter((n) => !n.isReadByUser)
      .map((n) => n._id);
    if (unreadIds.length === 0) return;

    try {
      await Promise.all(
        unreadIds.map((id) => notificationUserService.markAsRead(id))
      );
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isReadByUser: true }))
      );
      toast.success(t("notifications.toast.mark_all_success"));
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isReadByUser).length;

  useEffect(() => {
    if (onUnreadChange) {
      onUnreadChange(unreadCount);
    }
  }, [unreadCount, onUnreadChange]);

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="relative px-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            {role === "admin" ? "Thông Báo Đơn Hàng" : t("notifications.center_title")}
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          </h3>
          <button
            onClick={handleMarkAllAsRead}
            className="p-2 rounded-full cursor-pointer hover:bg-white dark:hover:bg-zinc-800 shadow-sm border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all text-zinc-500 hover:text-primary active:scale-90"
            title={t("notifications.mark_all_read_hint")}
          >
            <Icon icon="solar:checklist-minimalistic-bold" width={20} height={20} />
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest">
          {role === "admin" ? `` : t("notifications.unread_count", { count: unreadCount })}
        </p>
      </div>

      <div className="notice-tabs-container px-2">
        <NoticeTabs
          notifications={notifications}
          loading={loading}
          onMarkAsRead={handleMarkAsRead}
          role={role}
        />
      </div>

      <div className="p-3 border-t border-border">
        <button className="group w-full cursor-pointer py-2.5 px-4 hover:bg-primary/10 border border-border rounded-xl text-xs font-bold transition-all duration-300 shadow-sm flex items-center justify-center gap-2">
          {t("notifications.view_all_activity")}
          <Icon
            icon="solar:alt-arrow-right-linear"
            width={16}
            height={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
}

export function NoticeButton() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { accessToken } = useUserToken();
  const { role } = useUserInfo();

  // Load initial unread count WITHOUT opening the popover
  useEffect(() => {
    if (!accessToken) return;
    const fetchInitialCount = async () => {
      try {
        if (role === "admin") {
          const res = await notificationAdminService.getAll(1, 50, { type: NotificationType.ORDER });
          const count = res.data.notifications.filter(n => !n.isReadByUser).length;
          setUnreadCount(count);
        } else {
          const res = await notificationUserService.getAll(1, 50);
          const count = res.data.notifications.filter(n => n.type !== NotificationType.ORDER && !n.isReadByUser).length;
          setUnreadCount(count);
        }
      } catch (e) {
        console.error("Fetch unread error", e);
      }
    };
    fetchInitialCount();
  }, [accessToken, role]);

  // Global socket listener mapped onto the persistent Header button
  useEffect(() => {
    if (!accessToken) return;

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const socket: Socket = io(API_URL, {
      auth: { token: accessToken },
      transports: ["websocket", "polling"],
    });

    socket.on("new_notification", (data: any) => {
      // Play bell sound
      const audio = new Audio("https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=notification-sound-7062.mp3");
      audio.play().catch(e => console.log('Audio tracking blocked by browser', e));

      // Show toast
      toast.success(data.message || `CÓ THÔNG BÁO MỚI!`, {
        icon: "🔔",
        duration: 5000,
        description: data.notification?.title || "Kiểm tra hệ thống",
      });

      // Increment badge without refreshing the full list if closed
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [accessToken]);

  return (
    <Popover
      content={<NoticeContent onUnreadChange={setUnreadCount} />}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      overlayClassName="p-0 rounded-2xl overflow-hidden [&_.ant-popover-inner]:p-0 [&_.ant-popover-inner]:bg-background [&_.ant-popover-inner]:border-border/60 shadow-2xl"
      arrow={false}
      destroyTooltipOnHide={false}
    >
      <Button variant="ghost" size="icon" className="rounded-full">
        <Badge count={unreadCount} overflowCount={99} size="small" offset={[-4, 4]}>
          <Icon icon="solar:bell-bing-bold-duotone" size={24} className="text-zinc-600 dark:text-zinc-300" />
        </Badge>
      </Button>
    </Popover>
  );
}

function NoticeTabs({ notifications, loading, onMarkAsRead, role }: any) {
  const { t } = useTranslation();

  const unreadNotifications = useMemo(
    () => notifications.filter((n: any) => !n.isReadByUser),
    [notifications]
  );

  const items: TabsProps["items"] = useMemo(() => [
    {
      key: "all",
      label: <span className="px-2 py-1 italic font-medium">{t("notifications.tabs.latest")}</span>,
      children: (
        <NotificationList
          data={notifications}
          loading={loading}
          onMarkAsRead={onMarkAsRead}
          role={role}
        />
      ),
    },
    {
      key: "unread",
      label: (
        <div className="flex items-center gap-2 px-2">
          <span>{t("notifications.tabs.unread")}</span>
          {unreadNotifications.length > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full font-black animate-bounce">
              {unreadNotifications.length}
            </span>
          )}
        </div>
      ),
      children: (
        <NotificationList
          data={unreadNotifications}
          loading={loading}
          onMarkAsRead={onMarkAsRead}
          role={role}
        />
      ),
    },
  ], [notifications, loading, onMarkAsRead, unreadNotifications.length, t]);

  return (
    <Tabs
      defaultActiveKey="all"
      items={items}
      centered
      className="modern-tabs"
      tabBarStyle={{ borderBottom: "none", marginBottom: "8px" }}
    />
  );
}

function NotificationList({ data, loading, onMarkAsRead, role }: any) {
  const { t } = useTranslation();

  if (loading)
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} active avatar paragraph={{ rows: 1 }} />
        ))}
      </div>
    );

  if (data.length === 0)
    return (
      <EmptyState
        height="sm"
        title={role === "admin" ? "Chưa có đơn hàng nào" : t("notifications.empty.title")}
        description={role === "admin" ? "Đơn hàng mới của khách sẽ tự động hiển thị ở đây" : t("notifications.empty.description")}
      />
    );

  return (
    <div className="overflow-y-auto max-h-[300px] pb-2 space-y-2 custom-scroll">
      {data.map((item: Notification) => (
        <NotificationItem
          key={item._id}
          item={item}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
}
function NotificationItem({
  item,
  onMarkAsRead,
}: {
  item: Notification;
  onMarkAsRead: any;
}) {
  const { t } = useTranslation();
  const isUnread = !item.isReadByUser;

  const getIcon = (type: string) => {
    switch (type) {
      case NotificationType.SYSTEM:
        return {
          icon: "solar:shield-check-bold",
          color: "text-green-500",
          bg: "bg-green-50 dark:bg-green-500/10",
          label: t("notifications.types.system"), 
        };
      case NotificationType.MAINTENANCE:
        return {
          icon: "solar:danger-bold",
          color: "text-red-500",
          bg: "bg-red-50 dark:bg-red-500/10",
          label: t("notifications.types.maintenance"), 
        };
      case "order": // Explicit string check since enum might not have ORDER in frontend types yet
      case NotificationType.ORDER as string:
        return {
          icon: "solar:bag-smile-bold",
          color: "text-amber-500",
          bg: "bg-amber-50 dark:bg-amber-500/10",
          label: "Đơn Hàng",
        };
      default:
        return {
          icon: "solar:unread-bold",
          color: "text-blue-500",
          bg: "bg-blue-50 dark:bg-blue-500/10",
          label: t("notifications.types.general"), 
        };
    }
  };

  const meta = getIcon(item.type);
  const router = useRouter();

  return (
    <div
      onClick={() => {
        if (isUnread) onMarkAsRead(item._id);
        if (item.actionUrl) {
          let targetUrl = item.actionUrl;
          if (targetUrl.startsWith("/management/")) {
            targetUrl = `/admin${targetUrl}`;
          }
          router.push(targetUrl);
        }
      }}
      className={`group relative flex gap-2 p-2 rounded-2xl transition-all duration-300 border cursor-pointer ${
        isUnread
          ? "border-border border shadow-md"
          : "bg-transparent border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/50 opacity-80"
      }`}
    >
      <div className="relative flex-shrink-0">
        <div
          className={`w-12 h-12 rounded-2xl ${meta.bg} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}
        >
          <Icon icon={meta.icon} width={24} height={24} className={meta.color} />
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
          <span
            className={`text-[10px] font-black uppercase tracking-widest ${meta.color}`}
          >
            {meta.label}
          </span>
          <span className="text-[10px] text-muted-foreground font-bold italic">
            {dayjs(item.createdAt).fromNow()}
          </span>
        </div>

        <h4
          className={`text-[12px] leading-[1.4] line-clamp-2 ${
            isUnread
              ? "font-bold text-muted-foreground"
              : "font-medium text-zinc-500"
          }`}
        >
          {item.content}
        </h4>

        {isUnread && (
          <div className="mt-2 flex items-center gap-1 text-[10px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            {t("notifications.mark_as_read")}
            <Icon icon="solar:double-alt-arrow-right-bold" width={12} height={12} />
          </div>
        )}
      </div>
    </div>
  );
}
