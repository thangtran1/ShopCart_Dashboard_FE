import NewsManagement from "./components/NewsManagement";

export default function NewsPage() {
    return (
        <div className="bg-card text-card-foreground px-4 flex flex-col gap-6 rounded-xl border shadow-sm">
            <NewsManagement />
        </div>
    );
}
