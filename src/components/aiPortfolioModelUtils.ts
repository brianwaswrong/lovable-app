import type { SheetCellModel } from './spreadsheetTypes';

export type AIModelSupplyInputs = {
  dau: number;
  promptsPerUserPerDay: number;
  tokensPerPrompt: number;
  tokenPricePerMillion: number;
  commitDiscountPct: number;
  cacheHitRatePct: number;
  claudeDirectPct: number;
  claudeBedrockPct: number;
  geminiVertexPct: number;
  otherModelsPct: number;
  claudeDirectCommitDiscountPct: number;
  claudeBedrockCommitDiscountPct: number;
  geminiVertexCommitDiscountPct: number;
  otherModelsCommitDiscountPct: number;
};

export type SupplierInputKey =
  | 'claudeDirectPct'
  | 'claudeBedrockPct'
  | 'geminiVertexPct'
  | 'otherModelsPct';

export type ProviderRow = {
  supplier: string;
  accessPath: string;
  baseTokenCost: number;
  commitDiscountPct: number;
  effectiveCost: number;
  allocationPct: number;
  costContribution: number;
  colorToken: string;
  inputKey: SupplierInputKey;
  discountInputKey:
    | 'claudeDirectCommitDiscountPct'
    | 'claudeBedrockCommitDiscountPct'
    | 'geminiVertexCommitDiscountPct'
    | 'otherModelsCommitDiscountPct';
  baseMultiplier: number;
};

export type PortfolioOutputs = {
  monthlyTokens: number;
  processedTokens: number;
  blendedTokenPrice: number;
  monthlyInferenceCost: number;
  costPerResponse: number;
  monthlyGenerations: number;
  effectiveTokenPrice: number;
};

const DAYS_PER_MONTH = 30;

const SUPPLIER_META = [
  {
    key: 'claudeDirectPct',
    discountKey: 'claudeDirectCommitDiscountPct',
    supplier: 'Claude',
    accessPath: 'Direct API',
    baseMultiplier: 1,
    colorToken: 'var(--gatorade-base)',
  },
  {
    key: 'claudeBedrockPct',
    discountKey: 'claudeBedrockCommitDiscountPct',
    supplier: 'Claude',
    accessPath: 'AWS Bedrock',
    baseMultiplier: 1.08,
    colorToken: 'var(--green)',
  },
  {
    key: 'geminiVertexPct',
    discountKey: 'geminiVertexCommitDiscountPct',
    supplier: 'Gemini',
    accessPath: 'Google Vertex',
    baseMultiplier: 0.93,
    colorToken: 'var(--blue)',
  },
  {
    key: 'otherModelsPct',
    discountKey: 'otherModelsCommitDiscountPct',
    supplier: 'Other Models',
    accessPath: 'Multi-model routing',
    baseMultiplier: 0.89,
    colorToken: 'var(--gatorade-light-40)',
  },
] as const;

function roundTo(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function formatInputNumber(value: number) {
  if (Number.isInteger(value)) {
    return String(value);
  }

  return String(roundTo(value, 2));
}

export function normalizeAllocations(inputs: AIModelSupplyInputs) {
  const rawValues = SUPPLIER_META.map((supplier) => ({
    key: supplier.key,
    value: Math.max(Number(inputs[supplier.key]), 0),
  }));

  const total = rawValues.reduce((sum, entry) => sum + entry.value, 0);

  if (total <= 0) {
    return rawValues.map((entry, index) => ({
      key: entry.key,
      value: index === 0 ? 100 : 0,
    }));
  }

  return rawValues.map((entry) => ({
    key: entry.key,
    value: (entry.value / total) * 100,
  }));
}

export function calculatePortfolioOutputs(inputs: AIModelSupplyInputs): PortfolioOutputs {
  const monthlyGenerations = inputs.dau * inputs.promptsPerUserPerDay * DAYS_PER_MONTH;
  const monthlyTokens = monthlyGenerations * inputs.tokensPerPrompt;
  const processedTokens = monthlyTokens * (1 - inputs.cacheHitRatePct / 100);
  const allocations = normalizeAllocations(inputs);

  const rows = SUPPLIER_META.map((supplier, index) => {
    const baseTokenCost = inputs.tokenPricePerMillion * supplier.baseMultiplier;
    const effectiveCost =
      baseTokenCost * (1 - inputs[supplier.discountKey] / 100);
    const allocationPct = allocations[index].value;
    const costContribution =
      (processedTokens / 1_000_000) * (allocationPct / 100) * effectiveCost;

    return {
      baseTokenCost,
      effectiveCost,
      allocationPct,
      costContribution,
    };
  });

  const monthlyInferenceCost = rows.reduce((sum, row) => sum + row.costContribution, 0);
  const blendedTokenPrice = rows.reduce(
    (sum, row) => sum + (row.allocationPct / 100) * row.effectiveCost,
    0
  );
  const costPerResponse = monthlyInferenceCost / Math.max(monthlyGenerations, 1);
  const effectiveTokenPrice = rows.reduce(
    (sum, row) => sum + (row.allocationPct / 100) * row.effectiveCost,
    0
  );

  return {
    monthlyTokens: roundTo(monthlyTokens, 0),
    processedTokens: roundTo(processedTokens, 0),
    blendedTokenPrice: roundTo(blendedTokenPrice, 2),
    monthlyInferenceCost: roundTo(monthlyInferenceCost, 0),
    costPerResponse: roundTo(costPerResponse, 4),
    monthlyGenerations: roundTo(monthlyGenerations, 0),
    effectiveTokenPrice: roundTo(effectiveTokenPrice, 2),
  };
}

export function buildProviderRows(inputs: AIModelSupplyInputs): ProviderRow[] {
  const allocations = normalizeAllocations(inputs);
  const outputs = calculatePortfolioOutputs(inputs);

  return SUPPLIER_META.map((supplier, index) => {
    const baseTokenCost = inputs.tokenPricePerMillion * supplier.baseMultiplier;
    const commitDiscountPct = inputs[supplier.discountKey];
    const effectiveCost = baseTokenCost * (1 - commitDiscountPct / 100);
    const allocationPct = roundTo(allocations[index].value, 1);
    const costContribution = roundTo(
      (outputs.processedTokens / 1_000_000) * (allocationPct / 100) * effectiveCost,
      0
    );

    return {
      supplier: supplier.supplier,
      accessPath: supplier.accessPath,
      baseTokenCost: roundTo(baseTokenCost, 2),
      commitDiscountPct,
      effectiveCost: roundTo(effectiveCost, 2),
      allocationPct,
      costContribution,
      colorToken: supplier.colorToken,
      inputKey: supplier.key,
      discountInputKey: supplier.discountKey,
      baseMultiplier: supplier.baseMultiplier,
    };
  });
}

export function buildSheetCells(
  inputs: AIModelSupplyInputs,
  outputs: PortfolioOutputs,
  rows: ProviderRow[]
): SheetCellModel[] {
  const tableHeaderRow = 15;
  const firstSupplierRow = 16;

  const baseCells: SheetCellModel[] = [
    {
      id: 'A12',
      address: 'A12',
      row: 12,
      col: 1,
      colSpan: 2,
      variant: 'title',
      label: 'Supplier allocation matrix',
      tone: 'neutral',
    },
    {
      id: 'C12',
      address: 'C12',
      row: 12,
      col: 3,
      colSpan: 5,
      variant: 'note',
      label: 'Monthly tokens auto-compute from DAU, prompts, and token demand.',
      tone: 'neutral',
    },
    {
      id: 'A13',
      address: 'A13',
      row: 13,
      col: 1,
      colSpan: 1,
      variant: 'metric',
      label: 'DAU',
      tone: 'input',
      editableKey: 'dau',
      editableValue: inputs.dau,
    },
    {
      id: 'B13',
      address: 'B13',
      row: 13,
      col: 2,
      colSpan: 1,
      variant: 'metric',
      label: 'Prompts / user / day',
      tone: 'input',
      editableKey: 'promptsPerUserPerDay',
      editableValue: inputs.promptsPerUserPerDay,
    },
    {
      id: 'C13',
      address: 'C13',
      row: 13,
      col: 3,
      colSpan: 1,
      variant: 'metric',
      label: 'Tokens / prompt',
      tone: 'input',
      editableKey: 'tokensPerPrompt',
      editableValue: inputs.tokensPerPrompt,
    },
    {
      id: 'D13',
      address: 'D13',
      row: 13,
      col: 4,
      variant: 'metric',
      label: 'Cache hit rate %',
      tone: 'input',
      editableKey: 'cacheHitRatePct',
      editableValue: inputs.cacheHitRatePct,
      suffix: '%',
    },
    {
      id: 'E13',
      address: 'E13',
      row: 13,
      col: 5,
      variant: 'metric',
      label: 'Monthly token demand',
      value: formatCompactNumber(outputs.monthlyTokens),
      tone: 'formula',
      align: 'right',
      formula: '=A13*B13*30*C13',
    },
    {
      id: 'F13',
      address: 'F13',
      row: 13,
      col: 6,
      colSpan: 2,
      variant: 'wide',
      label: 'Tokens actually processed after cache',
      value: formatCompactNumber(outputs.processedTokens),
      tone: 'formula',
      align: 'right',
      formula: '=E13*(1-D13/100)',
    },
    {
      id: 'A14',
      address: 'A14',
      row: 14,
      col: 1,
      colSpan: 7,
      variant: 'note',
      label: '',
      tone: 'neutral',
    },
  ];

  const headerLabels = [
    'Supplier',
    'Access Path',
    'Base Token Cost',
    'Commit Discount',
    'Effective Cost',
    'Allocation %',
    'Cost Contribution',
  ];

  const headerCells: SheetCellModel[] = headerLabels.map((label, index) => ({
    id: `${String.fromCharCode(65 + index)}${tableHeaderRow}`,
    address: `${String.fromCharCode(65 + index)}${tableHeaderRow}`,
    row: tableHeaderRow,
    col: index + 1,
    variant: 'table-header',
    label,
    tone: 'neutral',
    align: index > 1 ? 'right' : 'left',
  }));

  const providerCells = rows.flatMap((row, index) => {
    const gridRow = firstSupplierRow + index;

    return [
      {
        id: `A${gridRow}`,
        address: `A${gridRow}`,
        row: gridRow,
        col: 1,
        variant: 'text',
        label: row.supplier,
        tone: 'neutral',
        dotColor: row.colorToken,
      },
      {
        id: `B${gridRow}`,
        address: `B${gridRow}`,
        row: gridRow,
        col: 2,
        variant: 'text',
        label: row.accessPath,
        tone: 'neutral',
      },
      {
        id: `C${gridRow}`,
        address: `C${gridRow}`,
        row: gridRow,
        col: 3,
        variant: 'text',
        value: formatCurrency(row.baseTokenCost, 2),
        tone: 'formula',
        align: 'right',
        formula: `=${inputs.tokenPricePerMillion.toFixed(2)}*${row.baseMultiplier.toFixed(2)}`,
      },
      {
        id: `D${gridRow}`,
        address: `D${gridRow}`,
        row: gridRow,
        col: 4,
        variant: 'text',
        tone: 'input',
        align: 'right',
        editableKey: row.discountInputKey,
        editableValue: row.commitDiscountPct,
        suffix: '%',
      },
      {
        id: `E${gridRow}`,
        address: `E${gridRow}`,
        row: gridRow,
        col: 5,
        variant: 'text',
        value: formatCurrency(row.effectiveCost, 2),
        tone: 'formula',
        align: 'right',
        formula: `=C${gridRow}*(1-D${gridRow}/100)`,
      },
      {
        id: `F${gridRow}`,
        address: `F${gridRow}`,
        row: gridRow,
        col: 6,
        variant: 'text',
        tone: 'input',
        align: 'right',
        editableKey: row.inputKey,
        editableValue: row.allocationPct,
        suffix: '%',
      },
      {
        id: `G${gridRow}`,
        address: `G${gridRow}`,
        row: gridRow,
        col: 7,
        variant: 'metric',
        value: formatCurrency(row.costContribution, 0),
        tone: 'formula',
        align: 'right',
        formula: `=E${gridRow}*(F${gridRow}/100)*(F13/1000000)`,
      },
    ] as SheetCellModel[];
  });

  const summaryCells: SheetCellModel[] = [
    {
      id: 'A20',
      address: 'A20',
      row: 20,
      col: 1,
      colSpan: 2,
      variant: 'summary',
      label: 'Blended token price',
      value: formatCurrency(outputs.blendedTokenPrice, 2),
      tone: 'formula',
      align: 'right',
      formula: '=((E16*F16)+(E17*F17)+(E18*F18)+(E19*F19))/100',
    },
    {
      id: 'C20',
      address: 'C20',
      row: 20,
      col: 3,
      colSpan: 3,
      variant: 'summary',
      label: 'Monthly inference cost',
      value: formatCurrency(outputs.monthlyInferenceCost, 0),
      tone: 'formula',
      align: 'right',
      formula: '=SUM(G16:G19)',
    },
    {
      id: 'F20',
      address: 'F20',
      row: 20,
      col: 6,
      colSpan: 2,
      variant: 'summary',
      label: 'Cost / AI response',
      value: formatCurrency(outputs.costPerResponse, 4),
      tone: 'formula',
      align: 'right',
      formula: '=C20/(A13*B13*30)',
    },
  ];

  return [...baseCells, ...headerCells, ...providerCells, ...summaryCells];
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatCurrency(value: number, digits = 0) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function formatPercent(value: number, digits = 1) {
  return `${roundTo(value, digits)}%`;
}

export function getInputDisplayValue(value: number) {
  return formatInputNumber(value);
}
