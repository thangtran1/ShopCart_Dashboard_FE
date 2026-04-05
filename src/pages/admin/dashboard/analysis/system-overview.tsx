import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { type ResponseStats, StatsPeriod, statsService } from "@/api/services/chartApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Skeleton } from "@/ui/skeleton";
import { motion } from "framer-motion";
import { Icon } from "@/components/icon";

export default function SystemOverview() {
  const { t } = useTranslation();
  const A = "dashboard.analysis";
  const [loading, setLoading] = useState(true);
  const [notifStats, setNotifStats] = useState<ResponseStats>({ labels: [], series: [] });
  const [activityStats, setActivityStats] = useState<ResponseStats>({ labels: [], series: [] });
  const [maintenanceStats, setMaintenanceStats] = useState<ResponseStats>({ labels: [], series: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notif, activity, maintenance] = await Promise.allSettled([
          statsService.notification(StatsPeriod.MONTH), statsService.activityLog(StatsPeriod.MONTH), statsService.maintenance(),
        ]);
        if (notif.status === "fulfilled") setNotifStats(notif.value);
        if (activity.status === "fulfilled") setActivityStats(activity.value);
        if (maintenance.status === "fulfilled") setMaintenanceStats(maintenance.value);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const sumSeries = (stats: ResponseStats, idx: number) => stats.series[idx]?.data?.reduce((a, b) => a + b, 0) || 0;

  const summaries = [
    { label: t(`${A}.notifications-sent`), value: sumSeries(notifStats, 0), icon: "lucide:bell", color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-950/30" },
    { label: t(`${A}.activities-logged`), value: sumSeries(activityStats, 0), icon: "lucide:activity", color: "text-emerald-600 dark:text-emerald-400", bgColor: "bg-emerald-100 dark:bg-emerald-950/30" },
    { label: t(`${A}.system-maintenance`), value: sumSeries(maintenanceStats, 0), icon: "lucide:wrench", color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-100 dark:bg-amber-950/30" },
    { label: t(`${A}.notifications-read`), value: sumSeries(notifStats, 1), icon: "lucide:mail-check", color: "text-violet-600 dark:text-violet-400", bgColor: "bg-violet-100 dark:bg-violet-950/30" },
    { label: t(`${A}.logins`), value: sumSeries(activityStats, 1), icon: "lucide:log-in", color: "text-rose-600 dark:text-rose-400", bgColor: "bg-rose-100 dark:bg-rose-950/30" },
    { label: t(`${A}.logouts`), value: sumSeries(activityStats, 2), icon: "lucide:log-out", color: "text-cyan-600 dark:text-cyan-400", bgColor: "bg-cyan-100 dark:bg-cyan-950/30" },
  ];

  if (loading) {
    return (<Card><CardHeader><CardTitle>{t(`${A}.system-overview`)}</CardTitle></CardHeader>
      <CardContent><Skeleton className="h-[300px] w-full rounded-xl" /></CardContent></Card>);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.5 }} className="h-full">
      <Card className="h-full">
        <CardHeader><CardTitle className="text-lg font-semibold">⚙️ {t(`${A}.system-overview`)}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {summaries.map((item, index) => (
              <motion.div key={item.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.85 + index * 0.07 }}
                className={`flex items-center gap-3 p-3 rounded-xl ${item.bgColor} transition-all hover:scale-[1.02] cursor-default`}>
                <div className={`flex items-center justify-center w-9 h-9 rounded-lg bg-background/80 shrink-0 ${item.color}`}>
                  <Icon icon={item.icon} size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-bold leading-none">{item.value.toLocaleString("vi-VN")}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200/50 dark:border-green-800/30">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <span className="text-sm font-semibold text-green-700 dark:text-green-400">{t(`${A}.system-running`)}</span>
            </div>
            <p className="text-xs text-green-600/70 dark:text-green-500/60 mt-1 ml-5">
              {t(`${A}.all-services-stable`)} {new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
