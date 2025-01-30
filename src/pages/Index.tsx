import LoginForm from "@/components/auth/LoginForm";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import UsageChart from "@/components/dashboard/UsageChart";
import { useState } from "react";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <h1 className="text-3xl font-bold text-water-800">
          Water Bill Management Dashboard
        </h1>
        <DashboardMetrics />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <UsageChart />
        </div>
      </div>
    </div>
  );
}