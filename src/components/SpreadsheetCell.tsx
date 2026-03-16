import type { ReactNode } from 'react';
import type {
  SheetCellVariant,
  SheetCellTone,
} from './spreadsheetTypes';

type SpreadsheetCellProps = {
  address: string;
  row: number;
  col: number;
  rowSpan?: number;
  colSpan?: number;
  variant: SheetCellVariant;
  label?: string;
  value?: string;
  valueTone?: SheetCellTone;
  selected?: boolean;
  editableValue?: number;
  onChange?: (value: number) => void;
  onSelect?: () => void;
  onInspectFormula?: () => void;
  prefix?: string;
  suffix?: string;
  align?: 'left' | 'center' | 'right';
  dotColor?: string;
  formulaVisible?: boolean;
  formulaContent?: ReactNode;
  highlighted?: boolean;
  muted?: boolean;
  emphasisLevel?: 'low' | 'medium' | 'high';
  className?: string;
};

function getGridPosition(
  row: number,
  col: number,
  rowSpan = 1,
  colSpan = 1
) {
  const gridRowStart = row - 10;
  const gridColumnStart = col;

  return {
    gridRow: `${gridRowStart} / span ${rowSpan}`,
    gridColumn: `${gridColumnStart} / span ${colSpan}`,
  };
}

export default function SpreadsheetCell({
  address,
  row,
  col,
  rowSpan = 1,
  colSpan = 1,
  variant,
  label,
  value,
  valueTone = 'neutral',
  selected = false,
  editableValue,
  onChange,
  onSelect,
  onInspectFormula,
  prefix,
  suffix,
  align = 'left',
  dotColor,
  formulaVisible = false,
  formulaContent,
  highlighted = false,
  muted = false,
  emphasisLevel = 'medium',
  className = '',
}: SpreadsheetCellProps) {
  const cellClassName = [
    'ai-sheet-content-cell',
    `is-${variant}`,
    `is-${valueTone}`,
    selected ? 'is-selected' : '',
    formulaVisible ? 'is-showing-formula' : '',
    align === 'right' ? 'is-right' : '',
    align === 'center' ? 'is-center' : '',
    onChange ? 'is-editable' : '',
    highlighted ? 'is-highlighted' : '',
    muted ? 'is-muted' : '',
    highlighted ? `is-emphasis-${emphasisLevel}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const valueNode =
    formulaVisible && formulaContent ? (
      <div className="ai-sheet-formula-inline">{formulaContent}</div>
    ) : onChange ? (
      <div className="ai-sheet-value-wrap">
        {prefix ? <span className="ai-sheet-value-affix">{prefix}</span> : null}
        <input
          type="number"
          value={editableValue ?? ''}
          step="any"
          inputMode="decimal"
          onClick={(event) => event.stopPropagation()}
          onFocus={() => onSelect?.()}
          onChange={(event) => {
            const nextValue = Number(event.target.value);
            if (!Number.isNaN(nextValue)) {
              onChange(nextValue);
            }
          }}
        />
        {suffix ? <span className="ai-sheet-value-affix">{suffix}</span> : null}
      </div>
    ) : (
      <div className="ai-sheet-value-wrap">
        {prefix ? <span className="ai-sheet-value-affix">{prefix}</span> : null}
        <strong>{value}</strong>
        {suffix ? <span className="ai-sheet-value-affix">{suffix}</span> : null}
      </div>
    );

  const hasVisibleValue =
    formulaVisible ||
    Boolean(onChange) ||
    (typeof value === 'string' && value.length > 0);

  return (
    <div
      className={cellClassName}
      style={getGridPosition(row, col, rowSpan, colSpan)}
      onClick={onSelect}
      onDoubleClick={onInspectFormula}
      data-address={address}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect?.();
        }
      }}
    >
      {variant === 'table-header' ? (
        <span className="ai-sheet-table-head-label">{label}</span>
      ) : variant === 'section-header' ? (
        <>
          {label ? <span className="ai-sheet-section-label">{label}</span> : null}
          {hasVisibleValue ? valueNode : null}
        </>
      ) : variant === 'title' ? (
        <span className="ai-sheet-title-label">{label}</span>
      ) : variant === 'note' ? (
        <p className="ai-sheet-note-label">{label}</p>
      ) : variant === 'text' && dotColor ? (
        <>
          <span className="ai-sheet-provider-chip">
            <i style={{ background: dotColor }} />
            {label}
          </span>
          {hasVisibleValue ? valueNode : null}
        </>
      ) : variant === 'text' ? (
        <>
          {label ? <span className="ai-sheet-text-label">{label}</span> : null}
          {hasVisibleValue ? valueNode : null}
        </>
      ) : (
        <>
          {label ? <span className="ai-sheet-cell-label">{label}</span> : null}
          {valueNode}
        </>
      )}
    </div>
  );
}
