import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

interface RiskItemProps {
  label: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
}

function RiskItem({ label, value, trend }: RiskItemProps) {
  let color = 'var(--color-status-green)';
  let status = 'Low';
  
  if (value >= 76) {
    color = 'var(--color-status-red)';
    status = 'Critical';
  } else if (value >= 51) {
    color = 'var(--color-status-orange)';
    status = 'High';
  } else if (value >= 31) {
    color = 'var(--color-status-yellow)';
    status = 'Moderate';
  }

  const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : Minus;
  const trendColor = trend === 'up' ? 'text-red-400' : trend === 'down' ? 'text-green-400' : 'text-gray-400';

  return (
    <div className="p-4 bg-[#090c10] rounded-md border border-[var(--color-panel-border)] flex flex-col justify-between">
      <div className="text-sm text-gray-400 mb-2">{label}</div>
      <div className="flex items-end justify-between">
        <div className="text-xl font-bold" style={{ color }}>{status}</div>
        <div className={`flex items-center text-xs ${trendColor}`}>
          <TrendIcon className="w-3 h-3 mr-1" />
          <span>{value}%</span>
        </div>
      </div>
    </div>
  );
}

export interface RiskData {
  label: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
}

interface RiskBreakdownProps {
  risks: RiskData[];
}

export function RiskBreakdown({ risks }: RiskBreakdownProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {risks.map((risk) => (
        <RiskItem key={risk.label} {...risk} />
      ))}
    </div>
  );
}
