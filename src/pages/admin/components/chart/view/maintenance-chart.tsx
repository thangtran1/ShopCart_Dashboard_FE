import { useEffect, useState } from "react";
import { Chart, useChart } from "@/components/admin/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { useTranslation } from "react-i18next";
import { ResponseStats, statsService } from "@/api/services/chartApi";

export default function MaintenanceChart() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<ResponseStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await statsService.maintenance();
        setStats(response);
      } catch (error) {
        console.error("Error fetching maintenance stats:", error);
        setStats({ labels: [], series: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("components.chart.total-maintenance")}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-muted">
            {t("components.chart.loading")}
          </p>
        ) : stats && stats.series.length > 0 ? (
          <ChartDonut stats={stats} key={JSON.stringify(stats.series)} />
        ) : (
          <p className="text-center text-muted">
            {t("components.chart.no-data")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ChartDonut({ stats }: { stats: ResponseStats }) {
  const { t, i18n } = useTranslation();

  const seriesValues = stats.series.slice(1).map((s) => s.data?.[0] ?? 0);

  const chartOptions = useChart({
    labels: [
      t("components.chart.active-maintenance"),
      t("components.chart.in_progress"),
      t("components.chart.completed"),
      t("components.chart.cancelled"),
      t("components.chart.scheduled"),
    ],
    colors: ["#28C76F", "#FF7F50", "#FFC107", "#FF4D4F", "#FF7F50"],
    stroke: { show: false },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      markers: { strokeWidth: 2, offsetX: -5 },
    },
    tooltip: { fillSeriesColor: false },
    chart: { width: 240 },
    plotOptions: {
      pie: {
        donut: {
          size: "90%",
          labels: {
            total: {
              label: t("components.chart.total"), // đổi ngôn ngữ
              formatter: () => {
                // sum
                return (stats.series[0]?.data?.[0] ?? 0).toString();
              },
              fontSize: "12px",
            },
            value: {
              fontSize: "18px",
              fontWeight: 700,
            },
          },
        },
      },
    },
  });

  return (
    <Chart
      key={i18n.language} // re-render khi đổi ngôn ngữ
      type="donut"
      series={seriesValues}
      options={chartOptions}
      height={360}
    />
  );
}
