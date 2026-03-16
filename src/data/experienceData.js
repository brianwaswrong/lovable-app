import liveNationNytImage from '../assets/livenation_nyt.png';

export const experienceMilestones = [
  {
    id: 'foundations',
    year: '2018-19',
    title: 'Live Nation & Expedia: Data Science roles',
    body: 'Learned full data scientist skillset, but was set on finance/strategy role at <Series-C company.',
    sub: 'Declined full-time return offers.',
    phase: 'foundations',
    phaseLabel: 'Foundations',
    motion: 'bottom-up',
    layout: 'left',
    progress: { enter: 0.02, active: 0.08, exit: 0.18 },
    track: { x: 13, y: 12 },
  },
  {
    id: 'seatgeek-join',
    year: '2019',
    title: 'Started at SeatGeek (Series C)',
    body: 'Joined the year we launched a new Enterprise partnerships business.',
    arr: '<$100M ARR',
    enterprise: '$3M',
    arrValue: 72,
    enterpriseValue: 3,
    phase: 'seatgeek',
    phaseLabel: 'SeatGeek Tenure',
    motion: 'graph-sequence',
    layout: 'graph',
    progress: { enter: 0.18, active: 0.26, exit: 0.36 },
    track: { x: 21, y: 79 },
    graph: {
      axis: { x: 21, y: 79 },
      card: { x: '20%', y: '68%', align: 'lower-left' },
    },
  },
  {
    id: 'stratfin',
    year: '2020',
    title: 'Founded Strategic Finance & Biz Ops team',
    body: 'Built 10-person team to steer Partnerships biz: deal models, 8-fig ARR negotiations. $3m to $330m B2B ARR <5 yrs',
    arr: '$186M ARR',
    enterprise: '$24M',
    arrValue: 186,
    enterpriseValue: 24,
    phase: 'seatgeek',
    phaseLabel: 'SeatGeek Tenure',
    motion: 'graph-sequence',
    layout: 'graph',
    progress: { enter: 0.3, active: 0.38, exit: 0.48 },
    track: { x: 38, y: 79 },
    graph: {
      axis: { x: 38, y: 79 },
      card: { x: '36%', y: '53%', align: 'upper-left' },
    },
  },
  {
    id: 'league-deals',
    year: '2022',
    title: '9-figure ARR league deal(s)',
    body: 'Modeled 9-figure technology & supply partnerships (NFL, MLB) & led go-live success with co-founder.',
    arr: '$399M ARR',
    enterprise: '$51M',
    arrValue: 399,
    enterpriseValue: 51,
    media: 'NFL / Taylor Swift headline placeholder',
    phase: 'seatgeek',
    phaseLabel: 'SeatGeek Tenure',
    motion: 'graph-sequence',
    layout: 'graph',
    progress: { enter: 0.42, active: 0.5, exit: 0.6 },
    track: { x: 53, y: 79 },
    graph: {
      axis: { x: 53, y: 79 },
      card: { x: '52%', y: '34%', align: 'upper-center' },
    },
  },
  {
    id: 'doj',
    year: '2023',
    title: 'Special Project(s): Department of Justice Antitrust lead',
    body: 'Led 20+ data scientists, C-suite, & counsel in 6-month subpoena. Result: DoJ lawsuit to break up largest competitor.',
    arr: '$649M ARR',
    enterprise: '$216M',
    arrValue: 649,
    enterpriseValue: 216,
    media: 'NYT / DOJ sues Live Nation placeholder',
    phase: 'seatgeek',
    phaseLabel: 'SeatGeek Tenure',
    motion: 'graph-sequence',
    layout: 'graph',
    progress: { enter: 0.54, active: 0.62, exit: 0.72 },
    track: { x: 67, y: 79 },
    graph: {
      axis: { x: 67, y: 79 },
      card: { x: '66%', y: '20%', align: 'upper-right' },
      mediaCard: {
        x: '44%',
        y: '31%',
        imageSrc: liveNationNytImage,
        alt: 'New York Times coverage of the Department of Justice lawsuit against Live Nation',
        className: 'is-doj-photo',
      },
    },
  },
  {
    id: 'interim-cos',
    year: '2024-25',
    title: 'Interim Chief of Staff',
    body: 'Enlisted to co-lead #1 company initiative ($196M rev impact) focused on Search & AI-discovery.',
    arr: '$900M+ ARR',
    enterprise: '$330M+',
    arrValue: 897,
    enterpriseValue: 330,
    phase: 'seatgeek',
    phaseLabel: 'SeatGeek Tenure',
    motion: 'graph-sequence',
    layout: 'graph',
    progress: { enter: 0.66, active: 0.74, exit: 0.84 },
    track: { x: 80, y: 79 },
    graph: {
      axis: { x: 80, y: 79 },
      card: { x: '80%', y: '12%', align: 'upper-right' },
    },
  },
  {
    id: 'deep-dive',
    year: 'Past Project',
    title: 'Past Project',
    subtitle:
      'Multi-party, 8-figure capital commit, 9-figure ARR deal I modeled & operationalized',
    cards: [
      {
        id: 'deal-scale',
        headline: '9-Figure ARR, multi-party partnerships',
        highlightGroups: ['deal-scale'],
      },
      {
        id: 'stat-model',
        headline: 'Statistically modeled revenue line items',
        highlightGroups: ['stat-model'],
      },
      {
        id: 'capital-commit',
        headline: '8-figure annual capital commits (akin to compute)',
        highlightGroups: ['capital-commit'],
      },
      {
        id: 'rev-share',
        headline:
          'Multi-Party Rev Shares to 30-150+ rightsholders',
        highlightGroups: ['rev-share'],
      },
      {
        id: 'scenario',
        headline: 'Scenario Analysis + Sensitivity for C-Suite',
        highlightGroups: ['scenario'],
      },
      {
        id: 'case-study-all',
        headline: 'Closed deal & led post-signature success',
        highlightGroups: [],
      },
    ],
    phase: 'deep-dive',
    phaseLabel: 'Case Study',
    motion: 'bottom-up',
    layout: 'case-study',
    renderMode: 'case-study',
    progress: { enter: 0.8, active: 0.87, exit: 0.96 },
    track: { x: 86, y: 90 },
  },
  {
    id: 'consulting-start',
    year: '2025',
    title: 'Built my consulting practice',
    body:
      'In 8 months, I:\n• Onboarded 22+ financial firms\n• Advised Series A consumer startup ($18m ARR)\n• Contracted w/OpenAI-backed AI startup ($100m ARR)',
    sub: 'Declined full-time offer(s).',
    phase: 'independent',
    phaseLabel: 'Independent Operator',
    motion: 'bottom-up',
    layout: 'right',
    progress: { enter: 0.84, active: 0.9, exit: 0.96 },
    track: { x: 86, y: 12 },
  },
  {
    id: 'consulting-present',
    year: 'Nov 25 - Present',
    title: 'Co-founded Dori project',
    body: 'Using AI to ship custom apps & BI tools for SMBs & indie cafes. 10 clients & 6-figure ARR run-rate in 3 months',
    sub: "This led me to Lovable & ambitions to share cheapening software on the grandest scale.",
    phase: 'independent',
    phaseLabel: 'Sharing the cheapening of software',
    motion: 'bottom-up',
    layout: 'right',
    progress: { enter: 0.93, active: 0.98, exit: 1.04 },
    track: { x: 86, y: 68 },
  },
];

export const journeyScene = {
  viewBox: '0 0 100 100',
  masterPath:
    'M 13 2 L 13 74 C 13 76.8 15.2 79 18 79 L 80 79 C 83.2 79 86 81.2 86 84 L 86 100',
  graphFrame: {
    left: 18,
    top: 24,
    right: 88,
    baseY: 79,
    yAxisX: 18,
    gridY: [42, 60],
  },
};

const graphMaxValue = 900;
const graphValueToY = (value) => {
  const clampedValue = Math.max(0, Math.min(value ?? 0, graphMaxValue));
  const span = journeyScene.graphFrame.baseY - journeyScene.graphFrame.top;

  return (
    journeyScene.graphFrame.baseY - (clampedValue / graphMaxValue) * span
  );
};

export const seatGeekGraphPoints = experienceMilestones
  .filter((milestone) => milestone.phase === 'seatgeek')
  .map((milestone) => ({
    milestoneId: milestone.id,
    year: milestone.year,
    label: milestone.title,
    body: milestone.body,
    arrLabel: milestone.arr,
    enterpriseLabel: milestone.enterprise,
    axis: milestone.graph.axis,
    seatGeek: {
      x: milestone.graph.axis.x,
      y: graphValueToY(milestone.arrValue),
    },
    enterprise: {
      x: milestone.graph.axis.x,
      y: graphValueToY(milestone.enterpriseValue),
    },
    card: milestone.graph.card,
    mediaCard: milestone.graph.mediaCard,
    progress: milestone.progress,
  }));

export const pageSections = [
  { id: 'intro', label: 'Intro' },
  { id: 'experience', label: 'Experience' },
  { id: 'lovable', label: 'Lovable' },
];
