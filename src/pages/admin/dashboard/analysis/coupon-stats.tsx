import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { couponService, type Coupon } from "@/api/services/couponApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Skeleton } from "@/ui/skeleton";
import { motion } from "framer-motion";
import { Icon } from "@/components/icon";

export default function CouponStats() {
  const { t } = useTranslation();
  const A = "dashboard.analysis";
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try { const res = await couponService.getAllCouponsAdmin({ page: 1, limit: 50 }); setCoupons(res?.data || []); }
      catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter((c) => c.isActive).length;
    const expired = coupons.filter((c) => new Date(c.expiryDate) < new Date()).length;
    const totalUsed = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);
    const totalLimit = coupons.reduce((sum, c) => sum + (c.usageLimit || 0), 0);
    const usageRate = totalLimit > 0 ? (totalUsed / totalLimit) * 100 : 0;
    return { total, active, expired, totalUsed, totalLimit, usageRate };
  }, [coupons]);

  if (loading) {
    return (<Card><CardHeader><CardTitle>{t(`${A}.coupons`)}</CardTitle></CardHeader>
      <CardContent><Skeleton className="h-[300px] w-full rounded-xl" /></CardContent></Card>);
  }

  const infoCards = [
    { label: t(`${A}.total-codes`), value: stats.total, icon: "lucide:ticket", color: "from-blue-500 to-indigo-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: t(`${A}.active-codes`), value: stats.active, icon: "lucide:check-circle", color: "from-green-500 to-emerald-500", bg: "bg-green-50 dark:bg-green-950/30" },
    { label: t(`${A}.expired`), value: stats.expired, icon: "lucide:clock", color: "from-amber-500 to-orange-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
    { label: t(`${A}.used`), value: stats.totalUsed, icon: "lucide:zap", color: "from-violet-500 to-purple-500", bg: "bg-violet-50 dark:bg-violet-950/30" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.5 }} className="h-full">
      <Card className="h-full">
        <CardHeader><CardTitle className="text-lg font-semibold">🎟️ {t(`${A}.coupons`)}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {infoCards.map((card, index) => (
              <motion.div key={card.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + index * 0.08 }}
                className={`flex items-center gap-3 p-3 rounded-xl ${card.bg} transition-all hover:scale-[1.02]`}>
                <div className={`flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br ${card.color} text-white shrink-0`}>
                  <Icon icon={card.icon} size={18} />
                </div>
                <div>
                  <p className="text-lg font-bold leading-none">{card.value.toLocaleString("vi-VN")}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{card.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{t(`${A}.total-usage-rate`)}</span>
              <span className="text-sm font-bold text-primary">{stats.usageRate.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                initial={{ width: 0 }} animate={{ width: `${Math.min(stats.usageRate, 100)}%` }} transition={{ delay: 1, duration: 1, ease: "easeOut" }} />
            </div>
            <div className="flex justify-between mt-1.5 text-[11px] text-muted-foreground">
              <span>{stats.totalUsed.toLocaleString("vi-VN")} {t(`${A}.used-count`)}</span>
              <span>{stats.totalLimit.toLocaleString("vi-VN")} {t(`${A}.total-count`)}</span>
            </div>
          </div>
          {coupons.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t(`${A}.top-used-coupons`)}</p>
              {coupons.sort((a, b) => (b.usedCount || 0) - (a.usedCount || 0)).slice(0, 3).map((coupon, index) => {
                const usage = coupon.usageLimit > 0 ? (coupon.usedCount / coupon.usageLimit) * 100 : 0;
                return (
                  <motion.div key={coupon._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 + index * 0.1 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/30 transition-colors">
                    <code className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">{coupon.code}</code>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-primary/60" style={{ width: `${Math.min(usage, 100)}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{coupon.usedCount}/{coupon.usageLimit}</span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
