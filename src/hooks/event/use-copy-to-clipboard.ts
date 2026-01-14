"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next"; 

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>;

type ReturnType = {
  copyFn: CopyFn;
  copiedText: CopiedValue;
};

export default function useCopyToClipboard(): ReturnType {
  const { t } = useTranslation(); 
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copyFn: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      toast.error(t("clipboard.error"));
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      
      toast.success(t("clipboard.success", { text }));
      
      return true;
    } catch (error) {
      console.warn("Copy failed", error);
      setCopiedText(null);
      toast.error(t("clipboard.error"));
      return false;
    }
  };

  return { copiedText, copyFn };
}