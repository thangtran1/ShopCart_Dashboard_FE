"use client";

import { Product } from "@/types";
import { Badge } from "@/ui/badge";
import { Collapse } from "antd";
import { ChevronDownIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

const { Panel } = Collapse;

const ProductCharacteristics = ({
  product,
}: {
  product: Product | null | undefined;
}) => {
  const { t } = useTranslation();

  return (
    <Collapse
      accordion
      expandIcon={({ isActive }) => (
        <ChevronDownIcon
          className={`size-4 text-muted-foreground transition-transform duration-200 ${
            isActive ? "rotate-180" : ""
          }`}
        />
      )}
      className="bg-white border border-border rounded-md shadow-sm"
    >
      <Panel
        header={
          <span className="text-sm font-medium hover:underline">
            {product?.name}: {t("product.characteristics")}
          </span>
        }
        key="1"
        className="text-sm"
      >
        <p className="flex items-center justify-between">
          {t("product.brand")}:{" "}
          {product?.brand?.name && (
            <span className="font-semibold tracking-wide">{product?.brand?.name}</span>
          )}
        </p>

        <p className="flex items-center mt-2 justify-between">
          {t("product.manufacturing_year")}:{" "}
          <span className="font-semibold tracking-wide">2025</span>
        </p>

        <p className="flex items-center mt-2 justify-between">
          {t("product.category")}:{" "}
          <span className="font-semibold tracking-wide">
            {product?.category?.name}
          </span>
        </p>

        <p className="flex items-center mt-2 justify-between">
          {t("product.status")}:{" "}
          {product?.stock && product?.stock > 0 ? (
            <Badge variant="success">{t("product.available")}</Badge>
          ) : (
            <Badge variant="error">{t("product.out_of_stock")}</Badge>
          )}
        </p>
      </Panel>
    </Collapse>
  );
};

export default ProductCharacteristics;