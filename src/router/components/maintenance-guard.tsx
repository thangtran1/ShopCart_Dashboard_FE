import { maintenanceApi } from "@/api/services/maintenanceApi";
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router";

interface MaintenanceGuardProps {
  children: ReactNode;
  redirectUrl: string;
}

const MaintenanceGuard = ({
  children,
  redirectUrl,
}: MaintenanceGuardProps) => {
  const [, setLoading] = useState(true);

  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const response = await maintenanceApi.getCurrentStatus();
        const isUnderMaintenance = response.data.data.isUnderMaintenance;

        if (isUnderMaintenance) {
          window.location.href = redirectUrl;
        } else {
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
      }
    };

    checkMaintenance();

    const interval = setInterval(checkMaintenance, 5000);

    return () => clearInterval(interval);
  }, [redirectUrl, pathname]);

  return <>{children}</>;
};

export default MaintenanceGuard;
