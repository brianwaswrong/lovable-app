import { useMemo, type CSSProperties } from 'react';
import SpreadsheetCell from './SpreadsheetCell';
import type { SheetCellModel, SpreadsheetConfig } from './spreadsheetTypes';

type InteractiveSpreadsheetProps = {
  cells: SheetCellModel[];
  onInputChange: (key: string, value: number) => void;
  activeCellId: string;
  formulaCellId: string | null;
  onCellSelect: (cellId: string) => void;
  onFormulaInspect: (cellId: string) => void;
  config: SpreadsheetConfig;
  activeHighlightGroups?: string[];
};

function renderFormulaTokens(formula: string, cellsByAddress: Map<string, SheetCellModel>) {
  const segments = formula.split(/([A-Z]+\d+)/g);

  return segments.map((segment, index) => {
    const referencedCell = cellsByAddress.get(segment);
    const toneClass = referencedCell ? `is-${referencedCell.tone ?? 'neutral'}` : '';

    return (
      <span key={`${segment}-${index}`} className={toneClass}>
        {segment}
      </span>
    );
  });
}

function getInputDisplayValue(value: number) {
  if (Number.isInteger(value)) {
    return String(value);
  }

  return String(Math.round(value * 100) / 100);
}

function toGroupList(highlightGroup?: string | string[]) {
  if (!highlightGroup) {
    return [];
  }

  return Array.isArray(highlightGroup) ? highlightGroup : [highlightGroup];
}

export default function InteractiveSpreadsheet({
  cells,
  onInputChange,
  activeCellId,
  formulaCellId,
  onCellSelect,
  onFormulaInspect,
  config,
  activeHighlightGroups = [],
}: InteractiveSpreadsheetProps) {
  const cellsByAddress = useMemo(
    () => new Map(cells.map((cell) => [cell.address, cell])),
    [cells]
  );
  const activeCell = cellsByAddress.get(activeCellId) ?? cells[0];
  const hasHighlights = activeHighlightGroups.length > 0;

  const formulaBarContent =
    activeCell && formulaCellId === activeCell.address && activeCell.formula ? (
      renderFormulaTokens(activeCell.formula, cellsByAddress)
    ) : activeCell?.editableKey ? (
      <span>{getInputDisplayValue(activeCell.editableValue ?? 0)}</span>
    ) : (
      <span>{activeCell?.value ?? activeCell?.label ?? ''}</span>
    );

  const columnWidths =
    config.columnWidths?.length === config.columnLabels.length
      ? config.columnWidths
      : config.columnLabels.map(() => 'minmax(124px, 1fr)');
  const rowHeights =
    config.rowHeights?.length === config.rowNumbers.length
      ? config.rowHeights
      : config.rowNumbers.map(() => 'var(--ai-grid-row-h)');

  const shellStyle = {
    '--ai-sheet-data-columns': config.columnLabels.length,
    '--ai-sheet-data-col-template': columnWidths.join(' '),
    '--ai-sheet-row-template': rowHeights.join(' '),
  } as CSSProperties;

  return (
    <div
      className={['ai-sheet-shell', config.className ?? ''].filter(Boolean).join(' ')}
      style={shellStyle}
    >
      <div className="ai-sheet-topbar">
        <div className="ai-sheet-doc-pill">{config.documentTitle}</div>
        <div className="ai-sheet-topbar-actions" aria-hidden="true">
          <span className="ai-window-control is-close">&times;</span>
          <span className="ai-window-control is-minimize">&#8722;</span>
          <span className="ai-window-control is-expand">+</span>
        </div>
      </div>

      {config.showFormulaBar === false ? null : (
        <div className="ai-sheet-formula-bar">
          <div className="ai-sheet-name-box">{activeCell?.address ?? 'A12'}</div>
          <div className="ai-sheet-fx-badge">fx</div>
          <div className="ai-sheet-formula-field">{formulaBarContent}</div>
        </div>
      )}

      <div className="ai-sheet-canvas">
        <div className="ai-sheet-grid-corner" />

        {config.columnLabels.map((label, index) => (
          <div
            key={label}
            className="ai-sheet-column-label"
            style={{ gridColumn: index + 2, gridRow: 1 }}
          >
            {label}
          </div>
        ))}

        {config.rowNumbers.map((rowNumber, index) => (
          <div
            key={rowNumber}
            className="ai-sheet-row-label"
            style={{ gridColumn: 1, gridRow: index + 2 }}
          >
            {rowNumber}
          </div>
        ))}

        {config.rowNumbers.flatMap((rowNumber, rowIndex) =>
          config.columnLabels.map((label, columnIndex) => (
            <div
              key={`${label}${rowNumber}`}
              className="ai-sheet-grid-cell"
              style={{ gridColumn: columnIndex + 2, gridRow: rowIndex + 2 }}
            />
          ))
        )}

        {cells.map((cell) => {
          const cellGroups = toGroupList(cell.highlightGroup);
          const isHighlighted = cellGroups.some((group) =>
            activeHighlightGroups.includes(group)
          );
          const isMuted = hasHighlights && cellGroups.length > 0 && !isHighlighted;

          return (
            <SpreadsheetCell
              key={cell.id}
              address={cell.address}
              row={cell.row}
              col={cell.col + 1}
              rowSpan={cell.rowSpan}
              colSpan={cell.colSpan}
              variant={cell.variant}
              label={cell.label}
              value={cell.value}
              valueTone={cell.tone}
              selected={activeCellId === cell.address}
              editableValue={cell.editableValue}
              onChange={
                cell.editableKey
                  ? (value) => onInputChange(cell.editableKey!, value)
                  : undefined
              }
              onSelect={() => onCellSelect(cell.address)}
              onInspectFormula={
                cell.formula ? () => onFormulaInspect(cell.address) : undefined
              }
              prefix={cell.prefix}
              suffix={cell.suffix}
              align={cell.align}
              dotColor={cell.dotColor}
              formulaVisible={formulaCellId === cell.address}
              formulaContent={
                cell.formula ? renderFormulaTokens(cell.formula, cellsByAddress) : undefined
              }
              highlighted={isHighlighted}
              muted={Boolean(isMuted) && !isHighlighted}
              emphasisLevel={cell.emphasisLevel}
              className={cell.className}
            />
          );
        })}
      </div>

      {config.overlayFade === 'right' ? (
        <div className="ai-sheet-fade ai-sheet-fade-right" aria-hidden="true" />
      ) : null}
    </div>
  );
}

