import { useMemo, useState } from 'react';
import InteractiveSpreadsheet from './InteractiveSpreadsheet';
import './SeatGeekCaseStudyPanel.css';
import {
  buildSeatGeekCaseStudyCells,
  calculateSeatGeekCaseStudyOutputs,
  seatGeekCaseStudyDefaultInputs,
  seatGeekCaseStudySheetConfig,
} from './seatGeekCaseStudyModelUtils';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getCardRevealWindow(index) {
  const start = 0.2 + index * 0.12;
  return { start, end: start + 0.11 };
}

export default function SeatGeekCaseStudyPanel({ item, progress }) {
  const [inputs, setInputs] = useState(seatGeekCaseStudyDefaultInputs);
  const [activeCellId, setActiveCellId] = useState('B16');
  const [formulaCellId, setFormulaCellId] = useState(null);

  const outputs = useMemo(
    () => calculateSeatGeekCaseStudyOutputs(inputs),
    [inputs]
  );
  const cells = useMemo(
    () => buildSeatGeekCaseStudyCells(inputs, outputs),
    [inputs, outputs]
  );

  const cards = item.cards ?? [];
  const cardStep = 76;

  const activeCardIndex = cards.reduce((current, _card, index) => {
    const { start } = getCardRevealWindow(index);
    return progress >= start ? index : current;
  }, 0);

  const activeCard = cards[activeCardIndex] ?? cards[0];

  return (
    <div className="journey-case-study-layout">
      <div className="journey-case-study-column is-left">
        <div className="journey-case-study-frame">
          <div className="journey-case-study-head">
            <div className="journey-case-study-kicker">{item.title}</div>
            <p className="journey-case-study-subtitle">{item.subtitle}</p>
          </div>

          <div className="journey-case-study-card-stack">
            {cards.map((card, index) => {
              const { start, end } = getCardRevealWindow(index);
              const revealProgress = clamp((progress - start) / (end - start), 0, 1);
              const isVisible = revealProgress > 0.02;
              const isActive = activeCardIndex === index && progress >= start;

              return (
                <article
                  key={card.id}
                  className={`journey-case-study-card ${
                    isActive ? 'is-active' : ''
                  } ${isVisible ? 'is-visible' : ''}`}
                  style={{
                    top: `${index * cardStep}px`,
                    opacity: revealProgress,
                    transform: `translateY(${(1 - revealProgress) * 18}px) scale(${
                      isActive ? 1.01 : 1
                    })`,
                  }}
                >
                  <div className="journey-case-study-card-row">
                    <span className="journey-case-study-card-index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <strong>{card.headline}</strong>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <div className="journey-case-study-column is-right">
        <div className="journey-case-study-frame">
          <InteractiveSpreadsheet
            cells={cells}
            onInputChange={(key, value) =>
              setInputs((current) => ({
                ...current,
                [key]: Number.isNaN(value) ? current[key] : value,
              }))
            }
            activeCellId={activeCellId}
            formulaCellId={formulaCellId}
            onCellSelect={(cellId) => {
              setActiveCellId(cellId);
              setFormulaCellId((current) => (current === cellId ? current : null));
            }}
            onFormulaInspect={(cellId) => {
              setActiveCellId(cellId);
              setFormulaCellId(cellId);
            }}
            config={seatGeekCaseStudySheetConfig}
            activeHighlightGroups={activeCard?.highlightGroups ?? []}
          />
        </div>
      </div>
    </div>
  );
}
