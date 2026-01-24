import ProductsManagement from "./components/ProductsManagement";

export default function ProductsPage() {
    return (
        <div className="bg-card text-card-foreground px-6 py-5 flex flex-col gap-4 rounded-xl border shadow-sm">
            <ProductsManagement />
        </div>
    );
}
