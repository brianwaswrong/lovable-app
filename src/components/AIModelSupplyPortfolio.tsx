import { useMemo, useState } from 'react';
import InteractiveSpreadsheet from './InteractiveSpreadsheet';
import InfoCalloutCard from './InfoCalloutCard';
import ProviderAllocationChart from './ProviderAllocationChart';
import {
  buildProviderRows,
  buildSheetCells,
  calculatePortfolioOutputs,
  formatCompactNumber,
  formatCurrency,
  type AIModelSupplyInputs,
} from './aiPortfolioModelUtils';
import {
  buildPlatformEcosystemSheetCells,
  calculatePlatformPartnerOutputs,
  platformEcosystemDefaultInputs,
  platformEcosystemSheetConfig,
  type PlatformEcosystemInputs,
} from './platformEcosystemModelUtils';
import './AIModelSupplyPortfolio.css';

const defaultInputs: AIModelSupplyInputs = {
  dau: 160000,
  promptsPerUserPerDay: 2.6,
  tokensPerPrompt: 1450,
  tokenPricePerMillion: 5.8,
  commitDiscountPct: 14,
  cacheHitRatePct: 24,
  claudeDirectPct: 38,
  claudeBedrockPct: 26,
  geminiVertexPct: 24,
  otherModelsPct: 12,
  claudeDirectCommitDiscountPct: 14,
  claudeBedrockCommitDiscountPct: 14,
  geminiVertexCommitDiscountPct: 14,
  otherModelsCommitDiscountPct: 14,
};

const tabs = [
  { id: 'supply-portfolio', label: 'Hyperscaler vs LLM Economics' },
  { id: 'ecosystem-econ', label: 'Platform Ecosystem Economics' },
] as const;

export default function AIModelSupplyPortfolio() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('supply-portfolio');
  const [inputs, setInputs] = useState(defaultInputs);
  const [platformInputs, setPlatformInputs] = useState(platformEcosystemDefaultInputs);
  const [platformHighlightGroup, setPlatformHighlightGroup] = useState<string | null>(null);
  const [portfolioActiveCellId, setPortfolioActiveCellId] = useState('A13');
  const [portfolioFormulaCellId, setPortfolioFormulaCellId] = useState<string | null>(null);
  const [platformActiveCellId, setPlatformActiveCellId] = useState('F14');
  const [platformFormulaCellId, setPlatformFormulaCellId] = useState<string | null>(null);

  const outputs = useMemo(() => calculatePortfolioOutputs(inputs), [inputs]);
  const providerRows = useMemo(() => buildProviderRows(inputs), [inputs]);
  const spreadsheetCells = useMemo(
    () => buildSheetCells(inputs, outputs, providerRows),
    [inputs, outputs, providerRows]
  );
  const platformPartnerOutputs = useMemo(
    () => calculatePlatformPartnerOutputs(platformInputs),
    [platformInputs]
  );
  const platformSpreadsheetCells = useMemo(
    () => buildPlatformEcosystemSheetCells(platformInputs, platformPartnerOutputs),
    [platformInputs, platformPartnerOutputs]
  );

  const handleInputChange = (key: string, value: number) => {
    setInputs((current) => ({
      ...current,
      [key]: Number.isNaN(value) ? current[key as keyof AIModelSupplyInputs] : value,
    }));
  };

  const handlePlatformInputChange = (key: string, value: number) => {
    setPlatformInputs((current) => ({
      ...current,
      [key]: Number.isNaN(value)
        ? current[key as keyof PlatformEcosystemInputs]
        : value,
    }));
  };

  const handlePortfolioCellSelect = (cellId: string) => {
    setPortfolioActiveCellId(cellId);
    setPortfolioFormulaCellId((current) => (current === cellId ? current : null));
  };

  const handlePortfolioFormulaInspect = (cellId: string) => {
    setPortfolioActiveCellId(cellId);
    setPortfolioFormulaCellId(cellId);
  };

  const handlePlatformCellSelect = (cellId: string) => {
    setPlatformActiveCellId(cellId);
    setPlatformFormulaCellId((current) => (current === cellId ? current : null));
  };

  const handlePlatformFormulaInspect = (cellId: string) => {
    setPlatformActiveCellId(cellId);
    setPlatformFormulaCellId(cellId);
  };

  return (
    <section id="lovable" className="section ai-partnerships-section">
      <div className="container">
        <div className="section-head ai-partnerships-head">
          <div className="eyebrow">Strategic Partnerships @ Lovable</div>
          <h2 className="section-title">How I'd Think About Lovable Partnerships</h2>
          <p className="section-copy">
            I'd apply my deal modeling & partnerships expertise to Lovable's position and unlock bottlenecks / new business lines. High level framing: 
            (a) Compute is a supply chain optimization problem, not a vendor decision. (b) Margin revenue is key as a powerful new distribution platform for partners.
          </p>
        </div>

        <div className="ai-tabs" role="tablist" aria-label="AI partnership models">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`ai-tab ${activeTab === tab.id ? 'is-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'supply-portfolio' ? (
          <div className="ai-model-layout">
            <div className="ai-main-stack">
              <div className="ai-panel-header">Inputs / Levers</div>
              <div className="ai-model-stage">
                <div className="ai-commentary-rail">
                  <InfoCalloutCard
                    className="ai-rail-callout is-routing"
                    title="Routing"
                    body="Allocate compute across multiple suppliers to optimize cost, capacity, and reliability."
                  />
                  <InfoCalloutCard
                    className="ai-rail-callout is-commit"
                    title="Commit Discounts"
                    body="Negotiate spend commitments in exchange for token pricing discounts."
                  />
                  <InfoCalloutCard
                    className="ai-rail-callout is-cache"
                    title="Caching"
                    body="Algorithmic routing + prompt caching to remove repeated context and lower inference costs."
                  />
                </div>

                <div className="ai-strategy-connectors" aria-hidden="true">
                  <div className="ai-strategy-connector is-routing">
                    <span className="ai-strategy-dot" />
                  </div>
                  <div className="ai-strategy-connector is-commit">
                    <span className="ai-strategy-dot" />
                  </div>
                  <div className="ai-strategy-connector is-cache">
                    <span className="ai-strategy-dot" />
                  </div>
                </div>

                <div className="ai-spreadsheet-column">
                  <InteractiveSpreadsheet
                    cells={spreadsheetCells}
                    onInputChange={handleInputChange}
                    activeCellId={portfolioActiveCellId}
                    formulaCellId={portfolioFormulaCellId}
                    onCellSelect={handlePortfolioCellSelect}
                    onFormulaInspect={handlePortfolioFormulaInspect}
                    config={{
                      documentTitle: 'AI Supply Portfolio',
                      columnLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
                      rowNumbers: Array.from({ length: 9 }, (_, index) => 12 + index),
                      rowHeights: [
                        'var(--ai-grid-row-h)',
                        'var(--ai-grid-row-h)',
                        'var(--ai-grid-gap-h)',
                        'var(--ai-grid-row-h)',
                        'var(--ai-grid-row-h)',
                        'var(--ai-grid-row-h)',
                        'var(--ai-grid-row-h)',
                        'var(--ai-grid-row-h)',
                        'var(--ai-grid-row-h)',
                      ],
                    }}
                  />
                </div>
              </div>
            </div>

            <aside className="ai-results-side">
              <div className="ai-panel-header">Outputs</div>
              <div className="ai-results-rail">
                <div className="ai-metric-card">
                  <span>Monthly tokens</span>
                  <strong>{formatCompactNumber(outputs.monthlyTokens)}</strong>
                </div>
                <div className="ai-metric-card">
                  <span>Blended token price</span>
                  <strong>{formatCurrency(outputs.blendedTokenPrice, 2)}</strong>
                </div>
                <div className="ai-metric-card">
                  <span>Monthly inference cost</span>
                  <strong>{formatCurrency(outputs.monthlyInferenceCost, 0)}</strong>
                </div>
                <div className="ai-metric-card">
                  <span>Cost per AI response</span>
                  <strong>{formatCurrency(outputs.costPerResponse, 4)}</strong>
                </div>

                <ProviderAllocationChart rows={providerRows} />
              </div>
            </aside>
          </div>
        ) : (
          <div className="ai-partnerships-body is-ecosystem-layout">
            <aside className="ai-ecosystem-rail">
              <InfoCalloutCard
                className="ai-rail-callout ai-ecosystem-callout"
                title="Attach Rate"
                body="The highest leverage variable in ecosystem partnerships is attach rate."
                onMouseEnter={() => setPlatformHighlightGroup('attach-rate')}
                onMouseLeave={() => setPlatformHighlightGroup(null)}
              />
              <InfoCalloutCard
                className="ai-rail-callout ai-ecosystem-callout"
                title="Wholesale Discount"
                body="Platform partners often exchange distribution access for discounted pricing or referral economics."
                onMouseEnter={() => setPlatformHighlightGroup('wholesale-discount')}
                onMouseLeave={() => setPlatformHighlightGroup(null)}
              />
            </aside>

            <div className="ai-spreadsheet-column is-platform-sheet-wrap">
              <InteractiveSpreadsheet
                cells={platformSpreadsheetCells}
                onInputChange={handlePlatformInputChange}
                activeCellId={platformActiveCellId}
                formulaCellId={platformFormulaCellId}
                onCellSelect={handlePlatformCellSelect}
                onFormulaInspect={handlePlatformFormulaInspect}
                config={platformEcosystemSheetConfig}
                activeHighlightGroups={platformHighlightGroup ? [platformHighlightGroup] : []}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
