import Title from "../../../ui/title";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Label } from "@/ui/label";
import { Brand } from "@/api/services/brands";

interface Props {
  brands: Brand[];
  selectedBrand?: string | null;
  setSelectedBrand: (value: string | null) => void;
}

const BrandList = ({ brands, selectedBrand, setSelectedBrand }: Props) => {
  const isAllSelected = !selectedBrand;

  return (
    <div className="w-full py-2">
      <Title className="text-base font-bold">Thương hiệu</Title>
      <RadioGroup value={selectedBrand || "all"} className="mt-2 space-y-1">
        <div
          onClick={() => setSelectedBrand(null)}
          className="flex items-center space-x-2 hover:cursor-pointer"
        >
          <RadioGroupItem
            value="all"
            id="all-brands"
            className="rounded-sm"
            checked={isAllSelected}
          />
          <Label
            htmlFor="all-brands"
            className={`${isAllSelected ? "font-semibold text-primary" : "font-normal"}`}
          >
            Tất cả thương hiệu
          </Label>
        </div>

        {/* Các brand khác */}
        {brands?.map((brand) => (
          <div
            key={brand?._id}
            onClick={() => setSelectedBrand(brand?.slug as string)}
            className="flex items-center space-x-2 hover:cursor-pointer"
          >
            <RadioGroupItem
              value={brand?.slug as string}
              id={brand?.slug}
              className="rounded-sm"
            />
            <Label
              htmlFor={brand?.slug}
              className={`${selectedBrand === brand?.slug ? "font-semibold text-primary" : "font-normal"}`}
            >
              {brand?.name}
            </Label>
          </div>
        ))}
        {selectedBrand && (
          <button
            onClick={() => setSelectedBrand(null)}
            className="text-sm cursor-pointer font-medium mt-2 underline underline-offset-2 decoration-[1px] hover:text-primary text-left"
          >
            Đặt lại lựa chọn
          </button>
        )}
      </RadioGroup>
    </div>
  );
};

export default BrandList;
