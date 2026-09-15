import type { Metadata } from "next"
import DashboardApp from "@/components/dashboard/dashboard-app"

export const metadata: Metadata = {
  title: "Dashboard — Workforce Attrition Intelligence",
  description:
    "Interactive HR analytics dashboard: attrition KPIs, department drill-downs, live risk prediction, model performance and a full data explorer.",
}

export default function DashboardPage() {
  return <DashboardApp />
}
