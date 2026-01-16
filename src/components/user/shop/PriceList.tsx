"use client";
import { useTranslation } from "react-i18next";
import Title from "../../../ui/title";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Label } from "@/ui/label";

interface Props {
  selectedPrice?: string | null;
  setSelectedPrice: (value: string | null) => void;
}

const PriceList = ({ selectedPrice, setSelectedPrice }: Props) => {
  const { t } = useTranslation();
  const isAllSelected = !selectedPrice;

  const priceArray = [
    { title: `${t("filter.under")} 5 ${t("filter.million")}`, value: "0-5000000" },
    { title: `5 - 10 ${t("filter.million")}`, value: "5000000-10000000" },
    { title: `10 - 20 ${t("filter.million")}`, value: "10000000-20000000" },
    { title: `20 - 30 ${t("filter.million")}`, value: "20000000-30000000" },
    { title: `${t("filter.above")} 30 ${t("filter.million")}`, value: "30000000-Infinity" },
  ];

  return (
    <div className="w-full pb-4">
      <Title className="text-base font-bold">{t("filter.price_title")}</Title>
      
      <RadioGroup className="mt-2 space-y-1" value={selectedPrice || "all"}>
        <div
          onClick={() => setSelectedPrice(null)}
          className="flex items-center space-x-2 hover:cursor-pointer group"
        >
          <RadioGroupItem
            value="all"
            id="all-prices"
            className="rounded-sm"
            checked={isAllSelected}
          />
          <Label
            htmlFor="all-prices"
            className={`cursor-pointer ${isAllSelected ? "font-semibold text-primary" : "font-normal"}`}
          >
            {t("filter.all_prices")}
          </Label>
        </div>

        {priceArray.map((price, index) => (
          <div
            key={index}
            onClick={() => setSelectedPrice(price.value)}
            className="flex items-center space-x-2 hover:cursor-pointer group"
          >
            <RadioGroupItem
              value={price.value}
              id={price.value}
              className="rounded-sm"
            />
            <Label
              htmlFor={price.value}
              className={`cursor-pointer ${
                selectedPrice === price.value ? "font-semibold text-primary" : "font-normal"
              }`}
            >
              {price.title}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {selectedPrice && (
        <button
          onClick={() => setSelectedPrice(null)}
          className="text-sm cursor-pointer font-medium mt-2 underline underline-offset-2 decoration-[1px] hover:text-primary transition-colors"
        >
          {t("filter.reset")}
        </button>
      )}
    </div>
  );
};

export default PriceList;