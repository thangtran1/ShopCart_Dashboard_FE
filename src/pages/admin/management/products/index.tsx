import ProductsManagement from "./components/ProductsManagement";

export default function ProductsPage() {
    return (
        <div className="bg-card text-card-foreground p-4 rounded-xl border shadow-sm">
            <ProductsManagement />
        </div>
    );
}
