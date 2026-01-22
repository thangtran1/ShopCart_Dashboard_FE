"use client";
import Title from "../../../ui/title";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Label } from "@/ui/label";
import { Brand } from "@/api/services/brands";
import { useTranslation } from "react-i18next";
import { Skeleton } from "antd";

interface Props {
  brands: Brand[];
  selectedBrand?: string | null;
  setSelectedBrand: (value: string | null) => void;
  loading?: boolean; 
}

const BrandList = ({ brands, selectedBrand, setSelectedBrand, loading }: Props) => {
  const { t } = useTranslation();
  const isAllSelected = !selectedBrand;

  if (loading) {
    return (
      <div className="w-full space-y-3">
        <Skeleton.Input active size="small" block />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton.Button key={i} active size="small" block className="h-4" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Title className="text-base font-bold">
        {t("shop.filter_brand_title")}
      </Title>

      <RadioGroup value={selectedBrand || "all"} className="mt-2 space-y-1">
        <div
          onClick={() => setSelectedBrand(null)}
          className="flex items-center space-x-2 hover:cursor-pointer group py-1"
        >
          <RadioGroupItem
            value="all"
            id="all-brands"
            className="rounded-sm"
            checked={isAllSelected}
          />
          <Label
            htmlFor="all-brands"
            className={`cursor-pointer transition-colors ${
              isAllSelected ? "font-semibold text-primary" : "font-normal group-hover:text-primary"
            }`}
          >
            {t("shop.all_brands")}
          </Label>
        </div>

        {brands?.map((brand) => (
          <div
            key={brand?._id}
            onClick={() => setSelectedBrand(brand?.slug as string)}
            className="flex items-center space-x-2 hover:cursor-pointer group py-1"
          >
            <RadioGroupItem
              value={brand?.slug as string}
              id={brand?.slug}
              className="rounded-sm"
            />
            <Label
              htmlFor={brand?.slug}
              className={`cursor-pointer transition-colors ${
                selectedBrand === brand?.slug
                  ? "font-semibold text-primary"
                  : "font-normal group-hover:text-primary"
              }`}
            >
              {brand?.name}
            </Label>
          </div>
        ))}

        {selectedBrand && (
          <button
            type="button"
            onClick={() => setSelectedBrand(null)}
            className="text-sm cursor-pointer font-medium mt-3 underline underline-offset-2 decoration-[1px] hover:text-primary text-left transition-colors"
          >
            {t("shop.reset_selection")}
          </button>
        )}
      </RadioGroup>
    </div>
  );
};

export default BrandList;