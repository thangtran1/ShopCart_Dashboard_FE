import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { getStringItem } from "@/utils/storage";

import en from "./lang/en";
import vi from "./lang/vi";

import { LocalEnum, StorageEnum } from "#/enum";

const defaultLng = getStringItem(StorageEnum.I18N) || (LocalEnum.en as string);

document.documentElement.lang = defaultLng;
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false, // tắt debug khi edit
    lng: defaultLng,
    fallbackLng: LocalEnum.en,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
  });

export default i18n;
export const t = i18n.t.bind(i18n);
