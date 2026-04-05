import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAllAuthSessions, type AuthSession } from "@/api/services/activity-logApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Skeleton } from "@/ui/skeleton";
import { motion } from "framer-motion";
import { Icon } from "@/components/icon";

export default function ActiveSessions() {
  const { t } = useTranslation();
  const A = "dashboard.analysis";
  const [sessions, setSessions] = useState<AuthSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try { const res = await getAllAuthSessions.getAll(1, 10, {}); setSessions(res?.data?.authSessions || []); }
      catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t(`${A}.just-now`);
    if (mins < 60) return t(`${A}.minutes-ago`, { count: mins });
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t(`${A}.hours-ago`, { count: hours });
    const days = Math.floor(hours / 24);
    return t(`${A}.days-ago`, { count: days });
  };

  const getDeviceIcon = (userAgent: string) => {
    const ua = userAgent?.toLowerCase() || "";
    if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) return "lucide:smartphone";
    if (ua.includes("tablet") || ua.includes("ipad")) return "lucide:tablet";
    return "lucide:monitor";
  };

  if (loading) {
    return (<Card><CardHeader><CardTitle>{t(`${A}.active-sessions`)}</CardTitle></CardHeader>
      <CardContent className="space-y-3">{Array.from({ length: 5 }).map((_, i) => (<Skeleton key={i} className="h-14 w-full rounded-lg" />))}</CardContent></Card>);
  }

  const onlineCount = sessions.filter((s) => s.sessionStatus === "active" || s.lastActivityType === "login").length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.5 }} className="h-full">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg font-semibold">🟢 {t(`${A}.active-sessions`)}</span>
            <span className="flex items-center gap-1.5 text-sm font-normal">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-muted-foreground">{onlineCount} {t(`${A}.online`)}</span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length > 0 ? (
            <div className="space-y-2">
              {sessions.slice(0, 8).map((session, index) => {
                const isOnline = session.sessionStatus === "active" || session.lastActivityType === "login";
                return (
                  <motion.div key={`${session.userId}-${index}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + index * 0.06 }}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/30 transition-colors">
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold text-primary">
                        {(session.userName || session.email || "?").charAt(0).toUpperCase()}
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${isOnline ? "bg-green-500" : "bg-gray-400"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{session.userName || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground truncate">{session.email}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Icon icon={getDeviceIcon(session.userAgent)} size={14} className="text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">{getTimeAgo(session.lastActivityTime)}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              <div className="text-center"><div className="text-4xl mb-2">🔒</div><p>{t(`${A}.no-sessions`)}</p></div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
