import CouponsManagement from "./components/CouponsManagement";

export default function CouponsPage() {
    return (
        <div className="bg-card text-card-foreground px-6 flex flex-col gap-6 rounded-xl border shadow-sm">
            <CouponsManagement />
        </div>
    );
}
