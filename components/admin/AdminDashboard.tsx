import { AIMetrics } from './AIMetrics';
import { CostMonitoring } from './CostMonitoring';
import { SystemMetrics } from './SystemMetrics';
import { UserManagement } from './UserManagement';

export function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SystemMetrics />
        <UserManagement />
        <CostMonitoring />
        <AIMetrics />
      </div>
    </div>
  );
}
