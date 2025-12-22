import { useEffect, useState } from "react";
import { Chart, useChart } from "@/components/admin/chart";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/ui/select";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle } from "@/ui/card";
import { CardContent } from "@/ui/card";
import { ResponseStats, StatsPeriod, statsService } from "@/api/services/chartApi";

export default function ChartColumnActiveInactive() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<StatsPeriod>(StatsPeriod.MONTH);
  const [statusUserStats, setStatusUserStats] = useState<ResponseStats>({
    labels: [],
    series: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statsService.user(period);
        setStatusUserStats(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, [period]);

  const chartOptions = useChart({
    plotOptions: { bar: { columnWidth: "60%" } },
    xaxis: { categories: statusUserStats.labels },
    tooltip: {
      y: { formatter: (val: number) => `${val} users` },
    },
    stroke: { width: 2, colors: ["transparent"] },
    legend: {
      show: true,
      position: "top", // hoặc "bottom"
      markers: {
        strokeWidth: 2, // màu cho icon
        offsetX: -5, // 👈 khoảng cách giữa icon và chữ
      },
    },
  });

  if (!statusUserStats.labels.length)
    return <div>{t("components.chart.loading")}</div>;

  return (
    <Card className="flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t("components.chart.status-user-stats")}</span>
          <Select
            onValueChange={(v) => setPeriod(v as StatsPeriod)}
            defaultValue={period.toString()}
          >
            <SelectTrigger className="w-40">
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
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Chart
          type="bar"
          series={[
            {
              name: t("components.chart.total-users"),
              data: statusUserStats.series[0]?.data || [],
            },
            {
              name: t("components.chart.total-active-users"),
              data: statusUserStats.series[1]?.data || [],
            },
            {
              name: t("components.chart.total-inactive-users"),
              data: statusUserStats.series[2]?.data || [],
            },
          ]}
          options={chartOptions}
          height={320}
        />
      </CardContent>
    </Card>
  );
}
