import { useEffect, useState } from "react";
import { Chart, useChart } from "@/components/admin/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { useTranslation } from "react-i18next";
import { ResponseStats, StatsPeriod, statsService } from "@/api/services/chartApi";


export default function ChartNotification() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<StatsPeriod>(StatsPeriod.MONTH);
  const [stats, setStats] = useState<ResponseStats>({
    labels: [],
    series: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statsService.notification(period);
        let data = response;

        // 🎯 Hiển thị label trực quan
        if (period === StatsPeriod.DAY) {
          data.labels = data.labels.map((h) => `${h}h`);
        } else if (
          period === StatsPeriod.WEEK ||
          period === StatsPeriod.MONTH
        ) {
          data.labels = data.labels.map((d) => d);
        } else if (period === StatsPeriod.YEAR) {
          data.labels = data.labels.map((y) => y);
        }

        setStats(data);
      } catch (error) {
        console.error("Error fetching notification stats:", error);
      }
    };

    fetchStats();
  }, [period]);

  return (
    <Card className="flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t("components.chart.notification-stats")}</span>
          <Select
            onValueChange={(value) => setPeriod(value as StatsPeriod)}
            defaultValue={period.toString()}
          >
            <SelectTrigger>
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
        <ChartArea stats={stats} />
      </CardContent>
    </Card>
  );
}

// 🧭 Khu vực hiển thị biểu đồ
function ChartArea({ stats }: { stats: ResponseStats }) {
  const { t } = useTranslation();
  const chartOptions = useChart({
    colors: ["#1890ff", "#52c41a", "#ff4d4f"],
    xaxis: {
      type: "category",
      categories: stats.labels,
    },
    legend: {
      show: true,
      position: "top", // hoặc "bottom"
      markers: {
        strokeWidth: 2, // màu cho icon
        offsetX: -5, // 👈 khoảng cách giữa icon và chữ
      },
    },
  });

  return (
    <Chart
      type="area"
      series={[
        {
          name: t("components.chart.system"),
          data: stats.series[0]?.data || [],
        },
        {
          name: t("components.chart.news"),
          data: stats.series[1]?.data || [],
        },
        {
          name: t("components.chart.maintenance"),
          data: stats.series[2]?.data || [],
        },
      ]}
      options={chartOptions}
      height={300}
    />
  );
}
