import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Chart, useChart } from "@/components/admin/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { type ResponseStats, StatsPeriod, statsService } from "@/api/services/chartApi";
import { Skeleton } from "@/ui/skeleton";
import { motion } from "framer-motion";

export default function UserGrowthChart() {
  const { t } = useTranslation();
  const A = "dashboard.analysis";
  const [period, setPeriod] = useState<StatsPeriod>(StatsPeriod.MONTH);
  const [stats, setStats] = useState<ResponseStats>({ labels: [], series: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try { setLoading(true); const res = await statsService.user(period); setStats(res); }
      catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [period]);

  const chartOptions = useChart({
    stroke: { width: [3, 3, 2], curve: "smooth" },
    fill: { type: ["gradient", "gradient", "solid"], gradient: { type: "vertical", shadeIntensity: 0, opacityFrom: 0.3, opacityTo: 0.05, stops: [0, 100] } },
    xaxis: { categories: stats.labels, type: "category" },
    legend: { show: true, position: "top", markers: { strokeWidth: 0, offsetX: -4 } },
    tooltip: { y: { formatter: (val: number) => `${val} ${t(`${A}.users-unit`)}` } },
    colors: ["#6366f1", "#22c55e", "#f59e0b"],
  });

  if (loading) {
    return (<Card><CardHeader><CardTitle>{t(`${A}.user-growth`)}</CardTitle></CardHeader>
      <CardContent><Skeleton className="h-[350px] w-full rounded-xl" /></CardContent></Card>);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg font-semibold">👥 {t(`${A}.user-growth`)}</span>
            <Select onValueChange={(v) => setPeriod(v as StatsPeriod)} defaultValue={period}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={StatsPeriod.DAY}>{t(`${A}.by-day`)}</SelectItem>
                <SelectItem value={StatsPeriod.WEEK}>{t(`${A}.by-week`)}</SelectItem>
                <SelectItem value={StatsPeriod.MONTH}>{t(`${A}.by-month`)}</SelectItem>
                <SelectItem value={StatsPeriod.YEAR}>{t(`${A}.by-year`)}</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.series.length > 0 ? (
            <Chart type="area" series={[
              { name: t(`${A}.total-user`), data: stats.series[0]?.data || [] },
              { name: t(`${A}.active`), data: stats.series[1]?.data || [] },
              { name: t(`${A}.inactive`), data: stats.series[2]?.data || [] },
            ]} options={chartOptions} height={350} />
          ) : (
            <div className="flex items-center justify-center h-[350px] text-muted-foreground">
              <div className="text-center"><div className="text-4xl mb-2">👤</div><p>{t(`${A}.no-user-data`)}</p></div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
