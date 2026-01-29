import { Icon } from "@/components/icon";
import { useTranslation } from "react-i18next";

interface StepIndicatorProps {
  currentStep: "upload" | "preview" | "result";
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const { t } = useTranslation();
  const steps = [
    {
      key: "upload",
      label: t("management.user.upload"),
      icon: "lucide:upload",
    },
    {
      key: "preview",
      label: t("management.user.preview-data"),
      icon: "lucide:eye",
    },
    {
      key: "result",
      label: t("management.user.result"),
      icon: "lucide:check-circle",
    },
  ];

  const getStepIndex = (step: string) => steps.findIndex((s) => s.key === step);
  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center mb-8 w-full">
      {steps.map((step, index) => (
        <div key={step.key} className="flex flex-col md:flex-row items-center">
          
          <div className="flex flex-col md:flex-row items-center">
            <div
              className={`
                flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                ${
                  index <= currentIndex
                    ? "border-success text-success"
                    : "bg-muted border-border text-muted-foreground"
                }
              `}
            >
              <Icon icon={step.icon} className="w-5 h-5" />
            </div>

            <div
              className={`
                mt-2 md:mt-0 md:ml-3 font-medium transition-all duration-300
                ${index <= currentIndex ? "text-success" : "text-muted-foreground"}
              `}
            >
              {step.label}
            </div>
          </div>

          {index < steps.length - 1 && (
            <div
              className={`
                transition-all duration-300
                /* Mobile: Gạch dọc */
                w-0.5 h-6 my-2 
                /* Desktop: Gạch ngang */
                md:w-16 md:h-0.5 md:mx-6 md:my-0
                ${index < currentIndex ? "bg-success" : "bg-gray-300"}
              `}
            />
          )}
        </div>
      ))}
    </div>
  );
}