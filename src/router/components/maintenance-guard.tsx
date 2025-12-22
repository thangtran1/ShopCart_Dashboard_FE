import { maintenanceApi } from "@/api/services/maintenanceApi";
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router";

interface MaintenanceGuardProps {
  children: ReactNode;
  redirectUrl: string;
  delayMs?: number;
}

const MaintenanceGuard = ({
  children,
  redirectUrl,
  delayMs = 1000,
}: MaintenanceGuardProps) => {
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const response = await maintenanceApi.getCurrentStatus();
        const isUnderMaintenance = response.data.data.isUnderMaintenance;

        setTimeout(() => {
          if (isUnderMaintenance) {
            window.location.href = redirectUrl;
          } else {
            setLoading(false);
          }
        }, delayMs);
      } catch (err) {
        setTimeout(() => setLoading(false), delayMs);
      }
    };

    checkMaintenance();
  }, [redirectUrl, delayMs, pathname]);

  // if (loading) {
  //   return <LoadingMaintenance />;
  // }

  return <>{children}</>;
};

export default MaintenanceGuard;
