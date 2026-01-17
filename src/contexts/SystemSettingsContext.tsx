import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getSystemSettings, SystemSettings } from "@/api/services/profileApi";
import { useTranslation } from "react-i18next";
import { StorageEnum } from "@/types/enum";

interface SystemSettingsContextType {
  settings: SystemSettings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SystemSettingsContext = createContext<
  SystemSettingsContextType | undefined
>(undefined);

interface SystemSettingsProviderProps {
  children: ReactNode;
}

export const SystemSettingsProvider: React.FC<SystemSettingsProviderProps> = ({
  children,
}) => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getSystemSettings();
      setSettings(data);
  
      // Kiểm tra xem LocalStorage đã có ngôn ngữ chưa
      const savedLng = localStorage.getItem(StorageEnum.I18N);
  
      // CHỈ đổi ngôn ngữ từ API nếu CHƯA CÓ lựa chọn riêng trong LocalStorage
      if (!savedLng && data.defaultLanguage && i18n.language !== data.defaultLanguage) {
        await i18n.changeLanguage(data.defaultLanguage);
      }
    } catch (error) {
      console.error("Error fetching system settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSettings = async () => {
    await fetchSettings();
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const value: SystemSettingsContextType = {
    settings,
    loading,
    refreshSettings,
  };

  return (
    <SystemSettingsContext.Provider value={value}>
      {children}
    </SystemSettingsContext.Provider>
  );
};

export const useSystemSettings = (): SystemSettingsContextType => {
  const context = useContext(SystemSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useSystemSettings must be used within a SystemSettingsProvider"
    );
  }
  return context;
};
