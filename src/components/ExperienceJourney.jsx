import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import ExperienceMilestoneCard from './ExperienceMilestoneCard';
import SeatGeekCaseStudyPanel from './SeatGeekCaseStudyPanel';
import './ExperienceJourney.css';
import {
  experienceMilestones,
  journeyScene,
  seatGeekGraphPoints,
} from '../data/experienceData';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function useSectionProgress(sectionRef) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const start = window.scrollY + rect.top - window.innerHeight * 0.16;
      const distance = Math.max(section.offsetHeight - window.innerHeight * 0.6, 1);
      const nextProgress = (window.scrollY - start) / distance;
      setProgress(clamp(nextProgress, 0, 1));
    };

    const requestUpdate = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [sectionRef]);

  return progress;
}

function useIsMobileViewport(breakpoint = 767) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', update);
      return () => mediaQuery.removeEventListener('change', update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, [breakpoint]);

  return isMobile;
}

function buildPartialPath(pathElement, progress, steps = 96) {
  if (!pathElement) return '';

  const totalLength = pathElement.getTotalLength();
  const safeProgress = clamp(progress, 0, 1);

  if (safeProgress <= 0 || totalLength <= 0) {
    return '';
  }

  const targetLength = totalLength * safeProgress;
  const segmentCount = Math.max(2, Math.ceil(steps * safeProgress));
  const points = [];

  for (let index = 0; index <= segmentCount; index += 1) {
    const distance = (targetLength * index) / segmentCount;
    const point = pathElement.getPointAtLength(distance);
    points.push(`${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`);
  }

  return points.join(' ');
}

function usePartialPath(pathRef, progress, steps = 96) {
  const [segmentPath, setSegmentPath] = useState('');

  useEffect(() => {
    const update = () => {
      if (!pathRef.current) return;
      setSegmentPath(buildPartialPath(pathRef.current, progress, steps));
    };

    update();
    window.addEventListener('resize', update);

    return () => window.removeEventListener('resize', update);
  }, [pathRef, progress, steps]);

  return segmentPath;
}

function getMilestoneState(progress, milestone) {
  const { enter, active, exit } = milestone.progress;

  if (progress <= enter) {
    return { opacity: 0, isActive: false, isPassed: false };
  }

  if (progress < active) {
    return {
      opacity: clamp((progress - enter) / Math.max(active - enter, 0.001), 0, 1),
      isActive: false,
      isPassed: false,
    };
  }

  if (progress <= exit) {
    return {
      opacity: clamp((exit - progress) / Math.max(exit - active, 0.001), 0.18, 1),
      isActive: true,
      isPassed: true,
    };
  }

  return { opacity: 0, isActive: false, isPassed: true };
}

function findActiveMilestone(progress, milestones) {
  return milestones.reduce((current, milestone) => {
    if (progress >= milestone.progress.active) {
      return milestone;
    }

    return current;
  }, milestones[0]);
}

function getJCurvePath(points, intensity = 'primary') {
  const getY = (point) =>
    intensity === 'primary'
      ? point.seatGeekY ?? point.y
      : point.enterpriseY ?? point.y;

  return points.reduce((path, point, index) => {
    const y = getY(point);

    if (index === 0) {
      return `M ${point.x} ${y}`;
    }

    const previousPoint = points[index - 1];
    const previousY = getY(previousPoint);
    const dx = point.x - previousPoint.x;
    const dy = y - previousY;
    const controlOneX = previousPoint.x + dx * 0.28;
    const controlTwoX = previousPoint.x + dx * 0.82;
    const controlOneY = previousY + dy * 0.08;
    const controlTwoY = previousY + dy * 0.92;

    return `${path}
      C ${controlOneX} ${controlOneY}, ${controlTwoX} ${controlTwoY}, ${point.x} ${y}`;
  }, '');
}

function renderGraphCard(point, progress) {
  const state = getMilestoneState(progress, { progress: point.progress });
  const isVisible = state.opacity > 0.05;

  return (
    <Fragment key={point.milestoneId}>
      <article
        className={`journey-graph-card ${point.card.align} ${
          isVisible ? 'is-visible' : ''
        }`}
        style={{
          left: point.card.x,
          top: point.card.y,
          opacity: state.opacity,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <strong>{point.label}</strong>
        <p>{point.body}</p>
        <div className="journey-graph-metrics">
          <em className="is-arr">{point.arrLabel}</em>
          <em className="is-enterprise">{point.enterpriseLabel}</em>
        </div>
      </article>

      {point.mediaCard ? (
        <div
          className={`journey-graph-photo-card ${point.mediaCard.className ?? ''} ${
            isVisible ? 'is-visible' : ''
          }`}
          style={{
            left: point.mediaCard.x,
            top: point.mediaCard.y,
            opacity: state.opacity,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <img src={point.mediaCard.imageSrc} alt={point.mediaCard.alt} />
        </div>
      ) : null}
    </Fragment>
  );
}

function YearPill({ year, className = '', style }) {
  return (
    <div className={`journey-year-pill ${className}`} style={style}>
      {year}
    </div>
  );
}

const topMilestones = experienceMilestones.slice(0, 7);
const consultingMilestones = experienceMilestones.slice(7);
const consultingWindows = [
  { enter: 0.08, active: 0.24, exit: 0.62 },
  { enter: 0.42, active: 0.7, exit: 1.04 },
];
const showStageStatus = false;
const railLeadPath = 'M 13 2 L 13 74 C 13 76.8 15.2 79 18 79 L 21 79';
const railAxisPath = 'M 21 79 L 80 79';
const railExitPath = 'M 80 79 C 83.2 79 86 81.2 86 84 L 86 100';

export default function ExperienceJourney() {
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const caseStudyPanelRef = useRef(null);
  const masterPathRef = useRef(null);
  const railLeadRef = useRef(null);
  const railAxisRef = useRef(null);
  const railExitRef = useRef(null);
  const greenPathRef = useRef(null);
  const bluePathRef = useRef(null);
  const bottomPathRef = useRef(null);
  const isMobileViewport = useIsMobileViewport();
  const topProgress = useSectionProgress(topRef);
  const bottomProgress = useSectionProgress(bottomRef);
  const caseStudyPanelProgress = useSectionProgress(caseStudyPanelRef);
  const [caseStudyProgressStart, setCaseStudyProgressStart] = useState(null);
  const graphOpacity =
    clamp((topProgress - 0.22) / 0.08, 0, 1) *
    (1 - clamp((topProgress - 0.8) / 0.06, 0, 1));
  const graphProgress = clamp((topProgress - 0.26) / 0.54, 0, 1);
  const graphRevealX = 21 + (80 - 21) * graphProgress;
  const leadRailProgress = clamp(topProgress / 0.26, 0, 1);
  const exitRailProgress = clamp((topProgress - 0.74) / 0.18, 0, 1);
  const leadRailProgressPath = usePartialPath(railLeadRef, leadRailProgress, 72);
  const exitRailProgressPath = usePartialPath(railExitRef, exitRailProgress, 48);
  const bottomProgressPath = usePartialPath(bottomPathRef, bottomProgress, 24);

  const activeMilestone = findActiveMilestone(topProgress, topMilestones);
  const caseStudyStageReveal = clamp((topProgress - 0.86) / 0.08, 0, 1);
  const normalizedCaseStudyProgress =
    caseStudyProgressStart === null
      ? 0
      : clamp(
          (caseStudyPanelProgress - caseStudyProgressStart) /
            Math.max(1 - caseStudyProgressStart, 0.001),
          0,
          1
        );
  const caseStudyPanelOpacity = isMobileViewport ? 1 : caseStudyStageReveal;
  const caseStudyPanelTranslateY = isMobileViewport
    ? 0
    : (1 - caseStudyStageReveal) * 48;
  const caseStudyPanelPointerEvents =
    isMobileViewport || caseStudyStageReveal > 0.02 ? 'auto' : 'none';
  const effectiveCaseStudyProgress = isMobileViewport
    ? 1
    : normalizedCaseStudyProgress;

  useEffect(() => {
    if (caseStudyStageReveal >= 0.98 && caseStudyProgressStart === null) {
      setCaseStudyProgressStart(caseStudyPanelProgress);
    }

    if (caseStudyStageReveal <= 0.02 && caseStudyProgressStart !== null) {
      setCaseStudyProgressStart(null);
    }
  }, [caseStudyPanelProgress, caseStudyProgressStart, caseStudyStageReveal]);
  const seatGeekSeriesPoints = useMemo(
    () =>
      seatGeekGraphPoints.map((point) => ({
        x: point.axis.x,
        y: point.axis.y,
        seatGeekY: point.seatGeek.y,
        enterpriseY: point.enterprise.y,
      })),
    []
  );

  const seatGeekCurvePath = useMemo(
    () => getJCurvePath(seatGeekSeriesPoints, 'primary'),
    [seatGeekSeriesPoints]
  );
  const enterpriseCurvePath = useMemo(
    () => getJCurvePath(seatGeekSeriesPoints, 'secondary'),
    [seatGeekSeriesPoints]
  );

  return (
    <section id="experience" className="section experience-journey-section">
      <div className="container">
        <div className="section-head journey-section-head">
          <div className="eyebrow">Experience & Projects</div>
          <h2 className="section-title">
            Path to <accent>Lovable</accent>
          </h2>
          <p className="section-copy">
            Data scientist, Biz Ops/Finance team founder to Chief-of-Staff, to now consulting OpenAI-backed startups & shipping tools for SMBs.
          </p>
        </div>
      </div>

      <div ref={topRef} className="journey-top">
        <div className="journey-stage-layer" aria-hidden="true">
          <div className="journey-stage-sticky">
            <div className="journey-stage-bleed">
              <div
                className="journey-graph-surface"
                style={{ opacity: graphOpacity * 0.94 }}
              />

              <div className="journey-graph-header" style={{ opacity: graphOpacity }}>
                <div className="mini-kicker">SeatGeek tenure</div>
                <div className="journey-graph-title">
                  High Trust, High Growth
                </div>
                <div className="journey-graph-legend">
                  <span>
                    <i className="journey-legend-line is-green" />
                    SeatGeek ARR
                  </span>
                  <span>
                    <i className="journey-legend-line is-blue" />
                    Partnerships ARR
                  </span>
                </div>
              </div>

              <div
                className="journey-graph-axis-label journey-graph-axis-y"
                style={{ opacity: graphOpacity }}
              >
                {[
                  { label: '$900M', y: journeyScene.graphFrame.top },
                  { label: '$600M', y: journeyScene.graphFrame.gridY[0] },
                  { label: '$300M', y: journeyScene.graphFrame.gridY[1] },
                  { label: '$0', y: journeyScene.graphFrame.baseY },
                ].map((tick) => (
                  <span key={tick.label} style={{ top: `${tick.y}%` }}>
                    {tick.label}
                  </span>
                ))}
              </div>

              <svg
                className="journey-stage-svg"
                viewBox={journeyScene.viewBox}
                preserveAspectRatio="none"
              >
                <defs>
                  <clipPath id="journey-graph-reveal" clipPathUnits="userSpaceOnUse">
                    <rect x="0" y="0" width={graphRevealX} height="100" />
                  </clipPath>
                </defs>

                <g className="journey-grid" style={{ opacity: graphOpacity }}>
                  <line
                    x1={journeyScene.graphFrame.yAxisX}
                    y1={journeyScene.graphFrame.top}
                    x2={journeyScene.graphFrame.yAxisX}
                    y2={journeyScene.graphFrame.baseY}
                  />
                  <line
                    x1={journeyScene.graphFrame.left}
                    y1={journeyScene.graphFrame.top}
                    x2={journeyScene.graphFrame.right}
                    y2={journeyScene.graphFrame.top}
                  />
                  {journeyScene.graphFrame.gridY.map((gridY) => (
                    <line
                      key={gridY}
                      x1={journeyScene.graphFrame.left}
                      y1={gridY}
                      x2={journeyScene.graphFrame.right}
                      y2={gridY}
                    />
                  ))}
                </g>

                <path
                  d={journeyScene.masterPath}
                  className="journey-master-path is-base"
                  ref={masterPathRef}
                />
                <path d={railLeadPath} ref={railLeadRef} className="journey-ref-path" />
                <path d={railAxisPath} ref={railAxisRef} className="journey-ref-path" />
                <path d={railExitPath} ref={railExitRef} className="journey-ref-path" />
                {leadRailProgressPath ? (
                  <path d={leadRailProgressPath} className="journey-master-path is-progress" />
                ) : null}
                <path
                  d={railAxisPath}
                  className="journey-master-path is-progress"
                  clipPath="url(#journey-graph-reveal)"
                />
                {exitRailProgressPath ? (
                  <path d={exitRailProgressPath} className="journey-master-path is-progress" />
                ) : null}

                <path
                  d={seatGeekCurvePath}
                  className="journey-series is-green is-shadow"
                  ref={greenPathRef}
                  style={{ opacity: graphOpacity * 0.14 }}
                />
                <path
                  d={seatGeekCurvePath}
                  className="journey-series is-green"
                  clipPath="url(#journey-graph-reveal)"
                  style={{ opacity: graphOpacity }}
                />

                <path
                  d={enterpriseCurvePath}
                  className="journey-series is-blue is-shadow"
                  ref={bluePathRef}
                  style={{ opacity: graphOpacity * 0.12 }}
                />
                <path
                  d={enterpriseCurvePath}
                  className="journey-series is-blue"
                  clipPath="url(#journey-graph-reveal)"
                  style={{ opacity: graphOpacity }}
                />
              </svg>

              <div className="journey-node-layer">
                <YearPill
                  year={topMilestones[0].year}
                  className="is-track-anchor is-track-anchor-left"
                  style={{
                    left: `${topMilestones[0].track.x}%`,
                    top: `${topMilestones[0].track.y}%`,
                  }}
                />
                {topMilestones.map((milestone) => {
                  const state = getMilestoneState(topProgress, milestone);

                  return (
                    <span
                      key={milestone.id}
                      className={`journey-node-dot ${state.isPassed ? 'is-reached' : ''}`}
                      style={{
                        left: `${milestone.track.x}%`,
                        top: `${milestone.track.y}%`,
                      }}
                    />
                  );
                })}
              </div>

              <div className="journey-series-dot-layer">
                {seatGeekGraphPoints.map((point) => {
                  const state = getMilestoneState(topProgress, {
                    progress: point.progress,
                  });

                  return (
                    <div key={point.milestoneId}>
                      <span
                        className={`journey-series-dot is-green ${
                          state.isPassed ? 'is-active' : ''
                        }`}
                        style={{
                          left: `${point.seatGeek.x}%`,
                          top: `${point.seatGeek.y}%`,
                          opacity: graphOpacity,
                        }}
                      />
                      <span
                        className={`journey-series-dot is-blue ${
                          state.isPassed ? 'is-active' : ''
                        }`}
                        style={{
                          left: `${point.enterprise.x}%`,
                          top: `${point.enterprise.y}%`,
                          opacity: graphOpacity,
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="journey-graph-card-layer">
                {seatGeekGraphPoints.map((point) => renderGraphCard(point, topProgress))}
              </div>

              <div className="journey-axis-pill-row" style={{ opacity: graphOpacity }}>
                {seatGeekGraphPoints.map((point) => {
                  const state = getMilestoneState(topProgress, {
                    progress: point.progress,
                  });

                  return (
                    <YearPill
                      key={point.milestoneId}
                      year={point.year}
                      className={`${state.isActive ? 'is-active' : ''} ${
                        state.opacity > 0.04 ? 'is-visible' : ''
                      }`}
                      style={{
                        left: `${point.axis.x}%`,
                        top: `calc(${journeyScene.graphFrame.baseY}% + var(--journey-pill-track-gap))`,
                        opacity: state.opacity,
                      }}
                    />
                  );
                })}
              </div>

              {showStageStatus ? (
                <div className="journey-stage-status">
                  <div className="journey-stage-status-year">{activeMilestone.year}</div>
                  <div className="journey-stage-status-phase">
                    {activeMilestone.phaseLabel}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="container">
          <div className="journey-top-story">
            <section className="journey-panel journey-panel-foundations">
              <div className="journey-opposed-layout is-left">
                <YearPill year={topMilestones[0].year} className="is-side" />
                <div
                  className="journey-panel-card-wrap"
                  style={{
                    opacity: getMilestoneState(topProgress, topMilestones[0]).opacity || 0.12,
                    transform: `translateY(${
                      (1 - getMilestoneState(topProgress, topMilestones[0]).opacity) * 28
                    }px)`,
                  }}
                >
                  <ExperienceMilestoneCard
                    item={topMilestones[0]}
                    index={0}
                    isActive={getMilestoneState(topProgress, topMilestones[0]).isActive}
                    isPassed={getMilestoneState(topProgress, topMilestones[0]).isPassed}
                  />
                </div>
              </div>
            </section>

            <div className="journey-mobile-graph-header">
              <div className="mini-kicker">SeatGeek tenure</div>
              <div className="journey-graph-title">High Trust, High Growth</div>
              <div className="journey-graph-legend">
                <span>
                  <i className="journey-legend-line is-green" />
                  SeatGeek ARR
                </span>
                <span>
                  <i className="journey-legend-line is-blue" />
                  Partnerships ARR
                </span>
              </div>
            </div>

            {seatGeekGraphPoints.map((point, seatGeekIndex) => (
              <section
                key={point.milestoneId}
                className="journey-panel journey-panel-seatgeek"
              >
                <div className="journey-panel-spacer" />
                <div className="journey-mobile-card">
                  <YearPill year={point.year} className="is-mobile-axis" />
                  <ExperienceMilestoneCard
                    item={topMilestones[seatGeekIndex + 1]}
                    index={seatGeekIndex + 1}
                    isActive={getMilestoneState(
                      topProgress,
                      topMilestones[seatGeekIndex + 1]
                    ).isActive}
                    isPassed={getMilestoneState(
                      topProgress,
                      topMilestones[seatGeekIndex + 1]
                    ).isPassed}
                  />
                </div>
              </section>
            ))}

            <section
              ref={caseStudyPanelRef}
              className="journey-panel journey-panel-full journey-panel-case-study"
            >
              <div className="journey-panel-card-wrap journey-panel-card-wrap-full">
                <div className="journey-case-study-stage">
                  <div
                    style={{
                      opacity: caseStudyPanelOpacity,
                      transform: `translateY(${caseStudyPanelTranslateY}px)`,
                      pointerEvents: caseStudyPanelPointerEvents,
                    }}
                  >
                    <YearPill year={topMilestones[6].year} className="is-center" />
                    {topMilestones[6].renderMode === 'case-study' ? (
                      <SeatGeekCaseStudyPanel
                        item={topMilestones[6]}
                        progress={effectiveCaseStudyProgress}
                      />
                    ) : (
                      <ExperienceMilestoneCard
                        item={topMilestones[6]}
                        index={6}
                        isActive={getMilestoneState(topProgress, topMilestones[6]).isActive}
                        isPassed={getMilestoneState(topProgress, topMilestones[6]).isPassed}
                      />
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div ref={bottomRef} className="journey-bottom">
        <div className="journey-bottom-rail-layer" aria-hidden="true">
          <div className="journey-bottom-rail">
            <svg
              className="journey-bottom-rail-svg"
              viewBox={journeyScene.viewBox}
              preserveAspectRatio="none"
            >
              <path d="M 86 0 L 86 100" className="journey-master-path is-base" />
              <path d="M 86 0 L 86 100" className="journey-master-path is-base" ref={bottomPathRef} />
              {bottomProgressPath ? (
                <path d={bottomProgressPath} className="journey-master-path is-progress" />
              ) : null}
            </svg>
            {consultingMilestones.map((item, index) => (
              <YearPill
                key={`${item.id}-track-pill`}
                year={item.year}
                className="is-track-anchor is-track-anchor-right"
                style={{
                  left: '86%',
                  top: `${item.id === 'consulting-start' ? 22 : 72}%`,
                }}
              />
            ))}
            {consultingMilestones.map((item, index) => {
              const state = getMilestoneState(bottomProgress, {
                progress: consultingWindows[index],
              });

              return (
                <span
                  key={item.id}
                  className={`journey-node-dot is-right-rail ${
                    state.isPassed ? 'is-reached' : ''
                  }`}
                  style={{ top: `${item.id === 'consulting-start' ? 22 : 72}%` }}
                />
              );
            })}
          </div>
        </div>

        <div className="container">
          <div className="journey-bottom-story">
            {consultingMilestones.map((item, index) => {
              const state = getMilestoneState(bottomProgress, {
                progress: consultingWindows[index],
              });

              return (
                <section key={item.id} className="journey-panel journey-panel-consulting">
                  <div className="journey-opposed-layout is-right">
                    <div
                      className="journey-panel-card-wrap"
                      style={{
                        opacity: state.opacity || 0.12,
                        transform: `translateY(${(1 - state.opacity) * 28}px)`,
                      }}
                    >
                      <ExperienceMilestoneCard
                        item={item}
                        index={index + topMilestones.length}
                        isActive={state.isActive}
                        isPassed={state.isPassed}
                      />
                    </div>
                    <YearPill year={item.year} className="is-side is-right" />
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
