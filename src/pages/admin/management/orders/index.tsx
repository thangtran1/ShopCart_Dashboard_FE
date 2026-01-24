import OrdersManagement from "./components/OrdersManagement";

export default function OrdersPage() {
    return (
        <div className="bg-card text-card-foreground px-6 flex flex-col gap-6 rounded-xl border shadow-sm">
            <OrdersManagement />
        </div>
    );
}
