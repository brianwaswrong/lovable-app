import type { CSSProperties } from 'react';
import { formatPercent } from './aiPortfolioModelUtils';

type AllocationRow = {
  supplier: string;
  allocationPct: number;
  colorToken: string;
  accessPath: string;
};

type ProviderAllocationChartProps = {
  rows: AllocationRow[];
};

export default function ProviderAllocationChart({
  rows,
}: ProviderAllocationChartProps) {
  return (
    <div className="ai-chart-card">
      <div className="ai-chart-head">
        <div>
          <span className="ai-chart-kicker">Supplier Allocation</span>
          <h4>Stacked demand allocation</h4>
        </div>
      </div>

      <div className="ai-stacked-bar" role="img" aria-label="Supplier allocation chart">
        {rows.map((row) => (
          <div
            key={`${row.supplier}-${row.accessPath}`}
            className="ai-stacked-segment"
            style={
              {
                width: `${row.allocationPct}%`,
                '--segment-color': row.colorToken,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="ai-chart-legend">
        {rows.map((row) => (
          <div key={`${row.supplier}-${row.accessPath}`} className="ai-chart-legend-item">
            <span
              className="ai-chart-legend-swatch"
              style={{ background: row.colorToken }}
            />
            <div>
              <strong>{row.supplier}</strong>
              <span>{formatPercent(row.allocationPct)} · {row.accessPath}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
