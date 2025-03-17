import { LineChart } from '@/components/charts/LineChart';
import { formatCurrency } from '@/lib/utils/format';
import { useEffect, useState } from 'react';

interface CostData {
  aiCosts: number;
  storageCosts: number;
  computeCosts: number;
  date: string;
}

export function CostMonitoring() {
  const [costData, setCostData] = useState<CostData[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [projectedCost, setProjectedCost] = useState(0);

  useEffect(() => {
    fetchCostData();
  }, []);

  async function fetchCostData() {
    try {
      const response = await fetch('/api/admin/costs');
      const data = await response.json();
      setCostData(data.costs);
      setTotalCost(data.totalCost);
      setProjectedCost(data.projectedCost);
    } catch (error) {
      console.error('Failed to fetch cost data:', error);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Cost Monitoring</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-600">Total Cost (MTD)</p>
          <p className="text-2xl font-bold">{formatCurrency(totalCost)}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-600">Projected Cost</p>
          <p className="text-2xl font-bold">{formatCurrency(projectedCost)}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-600">Daily Average</p>
          <p className="text-2xl font-bold">
            {formatCurrency(totalCost / new Date().getDate())}
          </p>
        </div>
      </div>

      <div className="h-64">
        <LineChart
          data={costData}
          xKey="date"
          yKey="aiCosts"
          label="AI Costs"
        />
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Cost Breakdown</h3>
        <div className="space-y-2">
          {Object.entries({
            AI: costData.reduce((sum, d) => sum + d.aiCosts, 0),
            Storage: costData.reduce((sum, d) => sum + d.storageCosts, 0),
            Compute: costData.reduce((sum, d) => sum + d.computeCosts, 0),
          }).map(([category, cost]) => (
            <div key={category} className="flex justify-between">
              <span>{category}</span>
              <span className="font-medium">{formatCurrency(cost)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
