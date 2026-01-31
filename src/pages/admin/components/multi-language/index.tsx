import { Icon } from "@/components/icon";
import useLocale from "@/locales/use-locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Separator } from "@/ui/separator";
import { LocalEnum } from "#/enum";
import { useTranslation } from "react-i18next";

export default function MultiLanguagePage() {
  const {
    setLocale,
    locale,
    language: { icon, label },
  } = useLocale();
  const { t } = useTranslation();

  return (
    <div className="bg-card text-card-foreground px-4 flex flex-col gap-6 rounded-xl border shadow-sm">
      {/* Header */}
      <div className="pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              🌐 {t("components.multiLanguage.title")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("components.multiLanguage.description")}
            </p>
          </div>
        </div>
      </div>
      <Separator />

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-2xl font-medium text-green-800">
              {t("components.multiLanguage.available-languages")}
            </div>
            <div className="p-2 bg-primary rounded-full">
              <Icon icon="lucide:languages" className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">2</div>
            <p className="text-xl text-green-700 mt-1">
              {t("components.multiLanguage.languages-supported")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-medium text-green-800">
              {t("components.multiLanguage.current-language")}
            </CardTitle>
            <div className="p-2 bg-green-500 rounded-full">
              <Icon icon="lucide:check-circle" className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Icon icon={`local:${icon}`} className="rounded-md" size="32" />
              <div className="text-xl font-bold text-green-800">{label}</div>
            </div>
            <p className="text-xl text-green-700 mt-1">
              {t("components.multiLanguage.active-now")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Language Selection */}
      <div className="py-4 pb-8">
        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <Icon icon="lucide:settings" className="h-5 w-5 text-muted" />
          {t("components.multiLanguage.select-language")}
        </h2>
        <p className="text-muted-foreground mt-1">
          {t("components.multiLanguage.select-language-description")}
        </p>
        <Separator className="my-6" />

        <div className="max-w-2xl">
          <RadioGroup
            onValueChange={(value: LocalEnum) => setLocale(value)}
            defaultValue={locale}
            className="grid grid-cols-1 gap-4"
          >
            <label
              htmlFor="en"
              className={`flex items-center gap-4 border-1 rounded-lg px-6 py-4 cursor-pointer transition-all hover:shadow-md ${
                locale === LocalEnum.en
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "hover:bg-muted"
              }`}
            >
              <RadioGroupItem
                value={LocalEnum.en}
                id="en"
                className="w-5 h-5"
              />
              <div className="flex items-center gap-3 flex-1">
                <Icon icon="local:flag-en" size="32" />
                <div>
                  <div className="text-lg font-semibold text-foreground">
                    {t("components.multiLanguage.en")}
                  </div>
                  <div className="text-sm text-foreground">
                    English (United States)
                  </div>
                </div>
              </div>
              {locale === LocalEnum.en && (
                <Icon
                  icon="lucide:check-circle-2"
                  className="h-6 w-6 text-primary"
                />
              )}
            </label>

            <label
              htmlFor="vi"
              className={`flex items-center gap-4 border-1 rounded-lg px-6 py-4 cursor-pointer transition-all hover:shadow-md ${
                locale === LocalEnum.vi
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "hover:bg-muted"
              }`}
            >
              <RadioGroupItem
                value={LocalEnum.vi}
                id="vi"
                className="w-5 h-5"
              />
              <div className="flex items-center gap-3 flex-1">
                <Icon icon="local:flag-vi" size="32" />
                <div>
                  <div className="text-lg font-semibold text-foreground">
                    {t("components.multiLanguage.vi")}
                  </div>
                  <div className="text-sm text-foreground">
                    Tiếng Việt (Việt Nam)
                  </div>
                </div>
              </div>
              {locale === LocalEnum.vi && (
                <Icon
                  icon="lucide:check-circle-2"
                  className="h-6 w-6 text-primary"
                />
              )}
            </label>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
