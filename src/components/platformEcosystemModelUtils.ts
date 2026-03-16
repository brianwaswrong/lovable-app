import type { SheetCellModel, SpreadsheetConfig } from './spreadsheetTypes';

export type PlatformEcosystemInputs = {
  supabaseMarketPrice: number;
  supabaseWholesale: number;
  supabaseUserPrice: number;
  supabaseAttachRatePct: number;
  supabaseUsage: number;
  stripeMarketPrice: number;
  stripeWholesale: number;
  stripeUserPrice: number;
  stripeAttachRatePct: number;
  stripeUsage: number;
  elevenLabsMarketPrice: number;
  elevenLabsWholesale: number;
  elevenLabsUserPrice: number;
  elevenLabsAttachRatePct: number;
  elevenLabsUsage: number;
};

type PlatformPartnerMeta = {
  id: 'supabase' | 'stripe' | 'elevenLabs';
  partner: string;
  service: string;
  row: number;
  summaryRow: number;
  marketPriceKey: keyof PlatformEcosystemInputs;
  wholesaleKey: keyof PlatformEcosystemInputs;
  userPriceKey: keyof PlatformEcosystemInputs;
  attachRateKey: keyof PlatformEcosystemInputs;
  usageKey: keyof PlatformEcosystemInputs;
  dotColor: string;
  pricePrefix?: string;
  priceSuffix?: string;
  usagePrefix?: string;
  usageSuffix?: string;
  marketPriceLabel: string;
  wholesaleLabel: string;
  userPriceLabel: string;
  attachRateLabel: string;
  usageLabel: string;
  marginLabel: string;
  priceDivisor: number;
  revenueFormula: (row: number) => string;
  marginFormula: (row: number) => string;
};

export type PlatformPartnerOutput = {
  id: PlatformPartnerMeta['id'];
  partner: string;
  service: string;
  row: number;
  summaryRow: number;
  marketPriceKey: keyof PlatformEcosystemInputs;
  wholesaleKey: keyof PlatformEcosystemInputs;
  userPriceKey: keyof PlatformEcosystemInputs;
  attachRateKey: keyof PlatformEcosystemInputs;
  usageKey: keyof PlatformEcosystemInputs;
  marketPrice: number;
  wholesale: number;
  userPrice: number;
  attachRatePct: number;
  usage: number;
  partnerDrivenRevenue: number;
  margin: number;
  dotColor: string;
};

const PLATFORM_PARTNERS: PlatformPartnerMeta[] = [
  {
    id: 'supabase',
    partner: 'Supabase',
    service: 'DB + Auth',
    row: 14,
    summaryRow: 20,
    marketPriceKey: 'supabaseMarketPrice',
    wholesaleKey: 'supabaseWholesale',
    userPriceKey: 'supabaseUserPrice',
    attachRateKey: 'supabaseAttachRatePct',
    usageKey: 'supabaseUsage',
    dotColor: 'var(--green)',
    pricePrefix: '$',
    priceSuffix: '/mo',
    usageSuffix: ' apps',
    marketPriceLabel: 'market plan',
    wholesaleLabel: 'partner rate',
    userPriceLabel: 'bundled price',
    attachRateLabel: 'workspace attach',
    usageLabel: 'active apps',
    marginLabel: 'monthly spread',
    priceDivisor: 1,
    revenueFormula: (row) => `=E${row}*(F${row}/100)*G${row}`,
    marginFormula: (row) => `=(E${row}-D${row})*(F${row}/100)*G${row}`,
  },
  {
    id: 'stripe',
    partner: 'Stripe',
    service: 'Payments',
    row: 15,
    summaryRow: 21,
    marketPriceKey: 'stripeMarketPrice',
    wholesaleKey: 'stripeWholesale',
    userPriceKey: 'stripeUserPrice',
    attachRateKey: 'stripeAttachRatePct',
    usageKey: 'stripeUsage',
    dotColor: 'var(--blue)',
    priceSuffix: '%',
    usagePrefix: '$',
    usageSuffix: ' GMV',
    marketPriceLabel: 'std. take',
    wholesaleLabel: 'partner take',
    userPriceLabel: 'user take',
    attachRateLabel: 'payments attach',
    usageLabel: 'monthly GMV',
    marginLabel: 'net retained',
    priceDivisor: 100,
    revenueFormula: (row) => `=(E${row}/100)*(F${row}/100)*G${row}`,
    marginFormula: (row) => `=((E${row}-D${row})/100)*(F${row}/100)*G${row}`,
  },
  {
    id: 'elevenLabs',
    partner: 'ElevenLabs',
    service: 'Voice',
    row: 16,
    summaryRow: 22,
    marketPriceKey: 'elevenLabsMarketPrice',
    wholesaleKey: 'elevenLabsWholesale',
    userPriceKey: 'elevenLabsUserPrice',
    attachRateKey: 'elevenLabsAttachRatePct',
    usageKey: 'elevenLabsUsage',
    dotColor: 'var(--gatorade-base)',
    pricePrefix: '$',
    priceSuffix: '/1k',
    usageSuffix: ' x1k',
    marketPriceLabel: 'list rate',
    wholesaleLabel: 'volume rate',
    userPriceLabel: 'bundled rate',
    attachRateLabel: 'voice attach',
    usageLabel: 'char blocks',
    marginLabel: 'usage spread',
    priceDivisor: 1,
    revenueFormula: (row) => `=E${row}*(F${row}/100)*G${row}`,
    marginFormula: (row) => `=(E${row}-D${row})*(F${row}/100)*G${row}`,
  },
];

export const platformEcosystemDefaultInputs: PlatformEcosystemInputs = {
  supabaseMarketPrice: 25,
  supabaseWholesale: 20,
  supabaseUserPrice: 24,
  supabaseAttachRatePct: 40,
  supabaseUsage: 2000000,
  stripeMarketPrice: 2.9,
  stripeWholesale: 2.7,
  stripeUserPrice: 2.9,
  stripeAttachRatePct: 30,
  stripeUsage: 500000000,
  elevenLabsMarketPrice: 0.15,
  elevenLabsWholesale: 0.12,
  elevenLabsUserPrice: 0.14,
  elevenLabsAttachRatePct: 10,
  elevenLabsUsage: 1000000,
};

export const platformEcosystemSheetConfig: SpreadsheetConfig = {
  documentTitle: 'Platform Ecosystem Economics',
  columnLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  rowNumbers: Array.from({ length: 11 }, (_, index) => 12 + index),
  columnWidths: [
    'minmax(102px, 1.02fr)',
    'minmax(90px, 0.92fr)',
    'minmax(92px, 0.9fr)',
    'minmax(96px, 0.94fr)',
    'minmax(90px, 0.9fr)',
    'minmax(82px, 0.78fr)',
    'minmax(98px, 0.96fr)',
    'minmax(106px, 1fr)',
  ],
  rowHeights: [
    '52px',
    '40px',
    '52px',
    '52px',
    '52px',
    '42px',
    '40px',
    '40px',
    '46px',
    '46px',
    '46px',
  ],
  className: 'is-platform-sheet',
};

function roundTo(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function formatPlatformCurrency(value: number, digits = 0) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function formatPlatformPercent(value: number, digits = 0) {
  return `${roundTo(value, digits).toFixed(digits)}%`;
}

export function calculatePlatformPartnerOutputs(
  inputs: PlatformEcosystemInputs
): PlatformPartnerOutput[] {
  return PLATFORM_PARTNERS.map((partner) => {
    const marketPrice = Number(inputs[partner.marketPriceKey]);
    const wholesale = Number(inputs[partner.wholesaleKey]);
    const userPrice = Number(inputs[partner.userPriceKey]);
    const attachRatePct = Number(inputs[partner.attachRateKey]);
    const usage = Number(inputs[partner.usageKey]);
    const activeAttachedUsage = usage * (attachRatePct / 100);
    const unitUserPrice = userPrice / partner.priceDivisor;
    const unitMargin = (userPrice - wholesale) / partner.priceDivisor;
    const partnerDrivenRevenue = unitUserPrice * activeAttachedUsage;
    const margin = unitMargin * activeAttachedUsage;

    return {
      id: partner.id,
      partner: partner.partner,
      service: partner.service,
      row: partner.row,
      summaryRow: partner.summaryRow,
      marketPriceKey: partner.marketPriceKey,
      wholesaleKey: partner.wholesaleKey,
      userPriceKey: partner.userPriceKey,
      attachRateKey: partner.attachRateKey,
      usageKey: partner.usageKey,
      marketPrice: roundTo(marketPrice, 2),
      wholesale: roundTo(wholesale, 2),
      userPrice: roundTo(userPrice, 2),
      attachRatePct: roundTo(attachRatePct, 1),
      usage: roundTo(usage, 0),
      partnerDrivenRevenue: roundTo(partnerDrivenRevenue, 0),
      margin: roundTo(margin, 0),
      dotColor: partner.dotColor,
    };
  });
}

export function buildPlatformEcosystemSheetCells(
  inputs: PlatformEcosystemInputs,
  partnerOutputs: PlatformPartnerOutput[]
): SheetCellModel[] {
  const partnerMetaById = new Map(PLATFORM_PARTNERS.map((partner) => [partner.id, partner]));

  const titleCells: SheetCellModel[] = [
    {
      id: 'A12',
      address: 'A12',
      row: 12,
      col: 1,
      colSpan: 3,
      variant: 'title',
      label: 'Platform partnership model',
      tone: 'neutral',
    },
    {
      id: 'D12',
      address: 'D12',
      row: 12,
      col: 4,
      colSpan: 5,
      variant: 'note',
      label:
        'Compact starter assumptions. Stripe uses % of GMV, and ElevenLabs usage is shown in 1k-character blocks.',
      tone: 'neutral',
      className: 'is-platform-note',
    },
  ];

  const coreHeaderLabels = [
    'Partner',
    'Service',
    'Market Price',
    'Lovable Wholesale',
    'User Price',
    'Attach Rate',
    'Usage',
    'Lovable Margin',
  ];

  const coreHeaderCells: SheetCellModel[] = coreHeaderLabels.map((label, index) => ({
    id: `${String.fromCharCode(65 + index)}13`,
    address: `${String.fromCharCode(65 + index)}13`,
    row: 13,
    col: index + 1,
    variant: 'table-header',
    label,
    tone: 'neutral',
    align: index >= 2 ? 'right' : 'left',
  }));

  const coreDataCells: SheetCellModel[] = partnerOutputs.flatMap(
    (partner) => {
      const meta = partnerMetaById.get(partner.id)!;

      return [
        {
          id: `A${partner.row}`,
          address: `A${partner.row}`,
          row: partner.row,
          col: 1,
          variant: 'text',
          label: partner.partner,
          tone: 'neutral',
          dotColor: partner.dotColor,
        },
        {
          id: `B${partner.row}`,
          address: `B${partner.row}`,
          row: partner.row,
          col: 2,
          variant: 'text',
          label: partner.service,
          tone: 'neutral',
        },
        {
          id: `C${partner.row}`,
          address: `C${partner.row}`,
          row: partner.row,
          col: 3,
          variant: 'metric',
          tone: 'input',
          label: meta.marketPriceLabel,
          align: 'right',
          editableKey: partner.marketPriceKey,
          editableValue: inputs[partner.marketPriceKey] as number,
          prefix: meta.pricePrefix,
          suffix: meta.priceSuffix,
        },
        {
          id: `D${partner.row}`,
          address: `D${partner.row}`,
          row: partner.row,
          col: 4,
          variant: 'metric',
          tone: 'input',
          label: meta.wholesaleLabel,
          align: 'right',
          editableKey: partner.wholesaleKey,
          editableValue: inputs[partner.wholesaleKey] as number,
          prefix: meta.pricePrefix,
          suffix: meta.priceSuffix,
          highlightGroup: 'wholesale-discount',
        },
        {
          id: `E${partner.row}`,
          address: `E${partner.row}`,
          row: partner.row,
          col: 5,
          variant: 'metric',
          tone: 'input',
          label: meta.userPriceLabel,
          align: 'right',
          editableKey: partner.userPriceKey,
          editableValue: inputs[partner.userPriceKey] as number,
          prefix: meta.pricePrefix,
          suffix: meta.priceSuffix,
        },
        {
          id: `F${partner.row}`,
          address: `F${partner.row}`,
          row: partner.row,
          col: 6,
          variant: 'metric',
          tone: 'input',
          label: meta.attachRateLabel,
          align: 'right',
          editableKey: partner.attachRateKey,
          editableValue: inputs[partner.attachRateKey] as number,
          suffix: '%',
          highlightGroup: 'attach-rate',
        },
        {
          id: `G${partner.row}`,
          address: `G${partner.row}`,
          row: partner.row,
          col: 7,
          variant: 'metric',
          tone: 'input',
          label: meta.usageLabel,
          align: 'right',
          editableKey: partner.usageKey,
          editableValue: inputs[partner.usageKey] as number,
          prefix: meta.usagePrefix,
          suffix: meta.usageSuffix,
        },
        {
          id: `H${partner.row}`,
          address: `H${partner.row}`,
          row: partner.row,
          col: 8,
          variant: 'metric',
          label: meta.marginLabel,
          value: formatPlatformCurrency(partner.margin, 0),
          tone: 'formula',
          align: 'right',
          formula: meta.marginFormula(partner.row),
          highlightGroup: 'wholesale-discount',
        },
      ] as SheetCellModel[];
    }
  );

  const noteCells: SheetCellModel[] = [
    {
      id: 'A17',
      address: 'A17',
      row: 17,
      col: 1,
      colSpan: 8,
      variant: 'note',
      label:
        'Margin follows the same core logic, with Stripe take rates converted from % before multiplying through usage.',
      tone: 'neutral',
      className: 'is-platform-note',
    },
    {
      id: 'A18',
      address: 'A18',
      row: 18,
      col: 1,
      colSpan: 8,
      variant: 'section-header',
      label: 'Partner summary',
      tone: 'neutral',
    },
  ];

  const summaryHeaderCells: SheetCellModel[] = [
    {
      id: 'A19',
      address: 'A19',
      row: 19,
      col: 1,
      colSpan: 2,
      variant: 'table-header',
      label: 'Partner',
      tone: 'neutral',
    },
    {
      id: 'C19',
      address: 'C19',
      row: 19,
      col: 3,
      colSpan: 2,
      variant: 'table-header',
      label: 'Partner-driven revenue',
      tone: 'neutral',
      align: 'right',
    },
    {
      id: 'E19',
      address: 'E19',
      row: 19,
      col: 5,
      colSpan: 2,
      variant: 'table-header',
      label: 'Margin',
      tone: 'neutral',
      align: 'right',
    },
    {
      id: 'G19',
      address: 'G19',
      row: 19,
      col: 7,
      colSpan: 2,
      variant: 'table-header',
      label: 'Attach rate',
      tone: 'neutral',
      align: 'right',
    },
  ];

  const summaryCells: SheetCellModel[] = partnerOutputs.flatMap(
    (partner) =>
      [
        {
          id: `A${partner.summaryRow}`,
          address: `A${partner.summaryRow}`,
          row: partner.summaryRow,
          col: 1,
          colSpan: 2,
          variant: 'text',
          label: partner.partner,
          tone: 'neutral',
          dotColor: partner.dotColor,
        },
        {
          id: `C${partner.summaryRow}`,
          address: `C${partner.summaryRow}`,
          row: partner.summaryRow,
          col: 3,
          colSpan: 2,
          variant: 'summary',
          value: formatPlatformCurrency(partner.partnerDrivenRevenue, 0),
          tone: 'formula',
          align: 'right',
          formula: partnerMetaById.get(partner.id)!.revenueFormula(partner.row),
        },
        {
          id: `E${partner.summaryRow}`,
          address: `E${partner.summaryRow}`,
          row: partner.summaryRow,
          col: 5,
          colSpan: 2,
          variant: 'summary',
          value: formatPlatformCurrency(partner.margin, 0),
          tone: 'formula',
          align: 'right',
          formula: `=H${partner.row}`,
          highlightGroup: 'wholesale-discount',
        },
        {
          id: `G${partner.summaryRow}`,
          address: `G${partner.summaryRow}`,
          row: partner.summaryRow,
          col: 7,
          colSpan: 2,
          variant: 'summary',
          value: formatPlatformPercent(partner.attachRatePct, 0),
          tone: 'formula',
          align: 'right',
          formula: `=F${partner.row}`,
          highlightGroup: 'attach-rate',
        },
      ] as SheetCellModel[]
  );

  return [
    ...titleCells,
    ...coreHeaderCells,
    ...coreDataCells,
    ...noteCells,
    ...summaryHeaderCells,
    ...summaryCells,
  ];
}
