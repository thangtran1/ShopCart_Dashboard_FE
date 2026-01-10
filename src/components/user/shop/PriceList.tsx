import Title from "../../../ui/title";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Label } from "@/ui/label";

const priceArray = [
  { title: "Dưới 5 triệu", value: "0-5000000" },
  { title: "5 - 10 triệu", value: "5000000-10000000" },
  { title: "10 - 20 triệu", value: "10000000-20000000" },
  { title: "20 - 30 triệu", value: "20000000-30000000" },
  { title: "Trên 30 triệu", value: "30000000-Infinity" },
];


interface Props {
  selectedPrice?: string | null;
  setSelectedPrice: (value: string | null) => void;
}
const PriceList = ({ selectedPrice, setSelectedPrice }: Props) => {
  const isAllSelected = !selectedPrice;

  return (
    <div className="w-full py-4">
      <Title className="text-base font-bold">Price</Title>
      <RadioGroup className="mt-2 space-y-1" value={selectedPrice || "all"}>
        <div
          onClick={() => setSelectedPrice(null)}
          className="flex items-center space-x-2 hover:cursor-pointer"
        >
          <RadioGroupItem
            value="all"
            id="all-prices"
            className="rounded-sm"
            checked={isAllSelected}
          />
          <Label
            htmlFor="all-prices"
            className={`${isAllSelected ? "font-semibold text-primary" : "font-normal"}`}
          >
            Tất cả mức giá
          </Label>
        </div>

        {/* Các mức giá khác */}
        {priceArray?.map((price, index) => (
          <div
            key={index}
            onClick={() => setSelectedPrice(price?.value)}
            className="flex items-center space-x-2 hover:cursor-pointer"
          >
            <RadioGroupItem
              value={price?.value}
              id={price?.value}
              className="rounded-sm"
            />
            <Label
              htmlFor={price.value}
              className={`${selectedPrice === price?.value ? "font-semibold text-primary" : "font-normal"}`}
            >
              {price?.title}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {selectedPrice && (
        <button
          onClick={() => setSelectedPrice(null)}
          className="text-sm cursor-pointer font-medium mt-2 underline underline-offset-2 decoration-[1px] hover:text-primary"
        >
          Đặt lại lựa chọn
        </button>
      )}
    </div>
  );
};

export default PriceList;
