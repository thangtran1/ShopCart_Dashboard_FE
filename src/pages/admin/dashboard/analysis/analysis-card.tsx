import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/icon";

interface AnalysisCardProps {
  title: string;
  value: number;
  formatter?: (v: number) => string;
  trend?: number;
  trendLabel?: string;
  icon: string;
  gradient: string;
  delay?: number;
}

function useCounter(end: number, duration = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (end === 0) {
      setValue(0);
      return;
    }
    let startTs: number | null = null;
    let rafId: number;
    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.floor(eased * end));
      if (progress < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [end, duration]);
  return value;
}

export default function AnalysisCard({
  title,
  value,
  formatter,
  trend,
  trendLabel,
  icon,
  gradient,
  delay = 0,
}: AnalysisCardProps) {
  const animatedValue = useCounter(value);
  const displayValue = formatter
    ? formatter(animatedValue)
    : animatedValue.toLocaleString("vi-VN");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
      className="relative overflow-hidden rounded-2xl p-6 text-white cursor-default select-none"
      style={{ background: gradient }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-12 -left-8 w-40 h-40 rounded-full bg-white/5" />

      {/* Background icon watermark */}
      <div className="absolute top-3 right-3 opacity-[0.12]">
        <Icon icon={icon} size={80} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm">
            <Icon icon={icon} size={22} />
          </div>
          <span className="text-sm font-medium text-white/80">{title}</span>
        </div>

        <div className="text-3xl font-bold mb-2 tracking-tight">
          {displayValue}
        </div>

        {trend !== undefined && (
          <div className="flex items-center gap-1.5">
            <div
              className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                trend >= 0
                  ? "bg-green-400/20 text-green-100"
                  : "bg-red-400/20 text-red-100"
              }`}
            >
              <Icon
                icon={
                  trend >= 0 ? "lucide:trending-up" : "lucide:trending-down"
                }
                size={14}
              />
              <span>
                {trend >= 0 ? "+" : ""}
                {trend.toFixed(1)}%
              </span>
            </div>
            {trendLabel && (
              <span className="text-xs text-white/60">{trendLabel}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
