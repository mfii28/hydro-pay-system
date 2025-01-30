import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import UsageChart from '@/components/dashboard/UsageChart';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-water-800">
            Water Bill Management Dashboard
          </h1>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
        
        <div className="space-y-8">
          <DashboardMetrics />
          <div className="grid grid-cols-1 gap-4">
            <UsageChart />
          </div>
        </div>
      </div>
    </div>
  );
}