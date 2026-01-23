import CustomerSurveyManagement from "./components/CustomerSurveyManagement";

export default function NewsPage() {
    return (
        <div className="bg-card text-card-foreground px-6 flex flex-col gap-6 rounded-xl border shadow-sm">
            <CustomerSurveyManagement />
        </div>
    );
}
