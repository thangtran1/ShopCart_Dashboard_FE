import TotalCard from "../../../dashboard/workbench/total-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { ResponseStats, StatsPeriod, statsService } from "@/api/services/chartApi";
export default function StatusUserChart() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<StatsPeriod>(StatsPeriod.MONTH);
  const [statusUserStats, setStatusUserStats] = useState<ResponseStats>({
    labels: [],
    series: [],
  });

  useEffect(() => {
    const fetchStatusUserStats = async () => {
      try {
        const response = await statsService.user(period);
        setStatusUserStats(response);
      } catch (error) {
        console.error("Error fetching status user stats:", error);
      }
    };
    fetchStatusUserStats();
  }, [period]);

  if (!statusUserStats || !statusUserStats.series.length) {
    return <div>{t("components.chart.loading")}</div>;
  }

  const totalUsers = statusUserStats.series[0].data.reduce(
    (acc, curr) => acc + curr,
    0
  );
  const activeUsers = statusUserStats.series[1].data.reduce(
    (acc, curr) => acc + curr,
    0
  );
  const inactiveUsers = statusUserStats.series[2].data.reduce(
    (acc, curr) => acc + curr,
    0
  );

  const activePercentage =
    totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : "0.0";
  const inactivePercentage =
    totalUsers > 0 ? ((inactiveUsers / totalUsers) * 100).toFixed(1) : "0.0";

  return (
    <div className="bg-card text-card-foreground p-3 flex flex-col gap-4 rounded-xl border shadow-sm">
      <div className="flex justify-end">
        <Select
          onValueChange={(value) => setPeriod(value as StatsPeriod)}
          defaultValue={period.toString()}
        >
          <SelectTrigger className="w-30">
            <SelectValue defaultValue={period.toString()} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={StatsPeriod.DAY}>
              {t("components.chart.day")}
            </SelectItem>
            <SelectItem value={StatsPeriod.WEEK}>
              {t("components.chart.week")}
            </SelectItem>
            <SelectItem value={StatsPeriod.MONTH}>
              {t("components.chart.month")}
            </SelectItem>
            <SelectItem value={StatsPeriod.YEAR}>
              {t("components.chart.year")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1">
          <TotalCard
            title={t("components.chart.total-users")}
            increase
            count={totalUsers.toString()}
            percent={"100%"}
            chartData={statusUserStats?.series?.[0]?.data}
          />
        </div>

        <div className="flex-1">
          <TotalCard
            title={t("components.chart.total-active-users")}
            increase
            count={activeUsers.toString()}
            percent={activePercentage}
            chartData={statusUserStats?.series?.[1]?.data}
          />
        </div>

        <div className="flex-1">
          <TotalCard
            title={t("components.chart.total-inactive-users")}
            increase
            count={inactiveUsers.toString()}
            percent={inactivePercentage}
            chartData={statusUserStats?.series?.[2]?.data}
          />
        </div>
      </div>
    </div>
  );
}
