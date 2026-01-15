"use client";
import Title from "../../../ui/title";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Label } from "@/ui/label";
import { useTranslation } from "react-i18next";

interface Props {
  categories: any[];
  selectedCategory?: string | null;
  setSelectedCategory: (value: string | null) => void;
}

const CategoryList = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: Props) => {
  const { t } = useTranslation();

  // Khi selectedCategory là null hoặc undefined → "Tất cả" được active
  const isAllSelected = !selectedCategory;

  return (
    <div>
      <Title className="text-base font-bold">
        {t("shop.filter_category_title")}
      </Title>

      <RadioGroup value={selectedCategory || "all"} className="mt-2 space-y-1">
        {/* Option: Tất cả sản phẩm */}
        <div
          onClick={() => setSelectedCategory(null)}
          className="flex items-center space-x-2 hover:cursor-pointer group"
        >
          <RadioGroupItem
            value="all"
            id="all-categories"
            className="rounded-sm"
            checked={isAllSelected}
          />
          <Label
            htmlFor="all-categories"
            className={`cursor-pointer transition-colors ${isAllSelected ? "font-semibold text-primary" : "font-normal group-hover:text-primary"
              }`}
          >
            {t("shop.all_products")}
          </Label>
        </div>

        {/* Các category từ API */}
        {categories?.map((category) => (
          <div
            onClick={() => setSelectedCategory(category?.slug as string)}
            key={category?._id}
            className="flex items-center space-x-2 hover:cursor-pointer group"
          >
            <RadioGroupItem
              value={category?.slug as string}
              id={category?.slug}
              className="rounded-sm"
            />
            <Label
              htmlFor={category?.slug}
              className={`cursor-pointer transition-colors ${selectedCategory === category?.slug
                ? "font-semibold text-primary"
                : "font-normal group-hover:text-primary"
                }`}
            >
              {category?.name}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {/* Nút đặt lại nhanh */}
      {selectedCategory && (
        <button
          onClick={() => setSelectedCategory(null)}
          className="text-sm cursor-pointer font-medium mt-3 underline underline-offset-2 decoration-[1px] hover:text-primary text-left transition-colors"
        >
          {t("shop.reset_selection")}
        </button>
      )}
    </div>
  );
};

export default CategoryList;