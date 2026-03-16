export type SheetCellTone = 'input' | 'formula' | 'neutral';

export type SheetCellVariant =
  | 'title'
  | 'note'
  | 'metric'
  | 'table-header'
  | 'text'
  | 'summary'
  | 'wide'
  | 'section-header';

export type SheetCellModel = {
  id: string;
  address: string;
  row: number;
  col: number;
  rowSpan?: number;
  colSpan?: number;
  variant: SheetCellVariant;
  label?: string;
  value?: string;
  tone?: SheetCellTone;
  align?: 'left' | 'center' | 'right';
  formula?: string;
  editableKey?: string;
  editableValue?: number;
  prefix?: string;
  suffix?: string;
  dotColor?: string;
  highlightGroup?: string | string[];
  emphasisLevel?: 'low' | 'medium' | 'high';
  mutedByOverlay?: boolean;
  className?: string;
};

export type SpreadsheetConfig = {
  documentTitle: string;
  columnLabels: string[];
  rowNumbers: number[];
  columnWidths?: string[];
  rowHeights?: string[];
  className?: string;
  overlayFade?: 'none' | 'right';
  showFormulaBar?: boolean;
};
