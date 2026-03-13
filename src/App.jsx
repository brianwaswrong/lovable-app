import { useEffect, useMemo, useRef, useState } from 'react';

const timelineData = [
  {
    year: '2018–2019',
    title: 'Live Nation & Expedia: Data Science roles',
    body: 'Learned the data science toolkit end-to-end, but knew I wanted pre-Series C operating work closer to finance, strategy, and company-building.',
    sub: 'Declined full-time return offers from both.',
  },
  {
    year: '2019',
    title: 'Started at live events startup SeatGeek',
    body: 'Joined SeatGeek (Series C) as it launched a new Enterprise Partnerships business.',
    arr: '<$100M',
    enterprise: '<$3M',
  },
  {
    year: '2020',
    title: 'Founded Strategic Finance & Biz Ops team with Chief-of-Staff',
    body: 'Built the strategic finance / biz ops motion supporting the new Enterprise business, including deal models, forecasting, KPIs, and cross-functional decision support.',
    arr: '~$186M',
    enterprise: '<$32M',
  },
  {
    year: '2022',
    title: '9-figure ARR league deal(s)',
    body: 'Modeled and negotiated 9-figure league deal(s) alongside SeatGeek’s co-founder across NFL, MLB, and Eras Tour-era ecosystem dynamics.',
    arr: '<$399M',
    enterprise: '<$98M',
    media: 'NFL / Taylor Swift news clip placeholder',
  },
  {
    year: '2023',
    title: 'Department of Justice Antitrust lead',
    body: 'Led a 20+ person working group across data science, VPs, C-suite, and counsel in a 9-month DOJ antitrust response culminating in the DOJ lawsuit against the category incumbent.',
    arr: '$649M',
    enterprise: '<$149M',
    media: 'NYT / DOJ sues Live Nation placeholder',
  },
  {
    year: '2024–25',
    title: 'Interim Chief of Staff',
    body: 'Enlisted by CEO office to co-lead a ~$196M ARR company initiative focused on Search and AI fan discovery.',
    arr: '$897M+',
    enterprise: '<$200M+',
  },
  {
    year: 'Deep Dive',
    title: 'Complex partnership economics',
    body: 'One deal meant 9-figure ARR, 8-figure fixed guarantees, 30–32 clubs, 300+ broker partners, multiple software providers, revenue share mechanics, R&D commitments, and an indirect-revenue counterfactual model using Prophet.',
    pills: [
      '9-figure ARR',
      '8-figure fixed guarantees',
      '1 league office + 30–32 clubs',
      '300+ broker partners',
      '3 other software providers',
      'Revenue share',
      'R&D commitments',
      'Prophet-based indirect revenue model',
    ],
  },
  {
    year: '2025',
    title: 'Started my own consulting practice',
    body: 'Advised 22+ financial-firm clients in under 8 months, plus 2 startups including a Series A consumer startup (~$18M ARR) and an OpenAI-backed AI-native startup.',
    sub: 'Declined a full-time offer.',
  },
  {
    year: 'Nov 2025–Present',
    title: 'Still building: consulting + AI-enabled SMB software',
    body: 'Now building low-cost AI software systems for SMBs and independent cafes/venues while continuing consulting engagements and sharpening my operator lens.',
    sub: 'This is the bridge into how I’d think about Strategic Partnerships at Lovable on day 0.',
  },
];

const graphPoints = [
  { year: '2019', seatGeek: 10, enterprise: 6, label: 'Joined SeatGeek' },
  {
    year: '2020',
    seatGeek: 26,
    enterprise: 14,
    label: 'Founded StratFin + Biz Ops',
  },
  {
    year: '2022',
    seatGeek: 55,
    enterprise: 35,
    label: '9-figure league deal(s)',
  },
  { year: '2023', seatGeek: 72, enterprise: 48, label: 'DOJ antitrust lead' },
  {
    year: '2024–25',
    seatGeek: 92,
    enterprise: 65,
    label: 'Interim Chief of Staff',
  },
];

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observers = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: '-35% 0px -45% 0px', threshold: 0.15 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);

  return active;
}

function Section({ id, children, className = '' }) {
  return (
    <section id={id} className={`section ${className}`}>
      <div className="container">{children}</div>
    </section>
  );
}

function Intro() {
  return (
    <Section id="intro" className="hero-section">
      <div className="hero-grid">
        <div>
          <div className="eyebrow">
            Finance • Biz Ops • Strategic Partnerships
          </div>
          <h1 className="hero-title">
            Hi — I’m <span className="accent">Brian</span>.
          </h1>
          <p className="hero-subtitle">
            I’m a 6+ year finance & biz operator who helped grow a new
            Enterprise partnerships division from{' '}
            <span className="accent-soft">$3M to $200M</span> in about five
            years.
          </p>
          <p className="hero-body">
            Today I run my own consulting practice and build AI-enabled software
            for SMBs, independent cafes, and venues — with 10 clients and
            6-figure ARR in under 3 months.
          </p>

          <div className="hero-actions">
            <a href="mailto:brianlei22@gmail.com" className="btn btn-primary">
              Email Brian
            </a>
            <a href="#experience" className="btn btn-secondary">
              View timeline
            </a>
          </div>
        </div>

        <div className="hero-card glass">
          <div className="mini-kicker">Why I fit Lovable</div>
          <div className="stat-row">
            <span>Enterprise growth built</span>
            <strong>$3M → $200M</strong>
          </div>
          <div className="stat-row">
            <span>Operator scope</span>
            <strong>Finance + Biz Ops + Deals</strong>
          </div>
          <div className="stat-row">
            <span>Builder instinct</span>
            <strong>AI-native SMB software</strong>
          </div>
          <div className="hero-track">
            <div className="hero-track-line" />
            <div className="pulse pulse-a" />
            <div className="pulse pulse-b" />
            <div className="pulse pulse-c" />
          </div>
        </div>
      </div>
    </Section>
  );
}

function Timeline({ activeIndex }) {
  const progress = ((activeIndex + 1) / timelineData.length) * 100;
  return (
    <div className="timeline-shell" aria-hidden="true">
      <div className="timeline-rail" />
      <div className="timeline-progress" style={{ height: `${progress}%` }} />
      {timelineData.map((item, i) => (
        <div
          key={item.title}
          className={`timeline-dot ${i <= activeIndex ? 'is-active' : ''}`}
          style={{ top: `${(i / (timelineData.length - 1)) * 100}%` }}
        />
      ))}
    </div>
  );
}

function ExperienceSection({ item, index, activeIndex }) {
  const isActive = index <= activeIndex;
  const isSeatGeek = index >= 1 && index <= 5;
  const isDeepDive = index === 6;

  return (
    <div className={`experience-row ${isActive ? 'visible' : ''}`}>
      <div className="year-pill">{item.year}</div>
      <div
        className={`experience-card glass ${isSeatGeek ? 'seatgeek-card' : ''}`}
      >
        <h2>{item.title}</h2>
        <p>{item.body}</p>
        {item.sub && <p className="muted">{item.sub}</p>}

        {(item.arr || item.enterprise) && (
          <div className="metric-grid">
            {item.arr && (
              <div className="metric-card">
                <span>SeatGeek ARR</span>
                <strong>{item.arr}</strong>
              </div>
            )}
            {item.enterprise && (
              <div className="metric-card">
                <span>Enterprise ARR</span>
                <strong>{item.enterprise}</strong>
              </div>
            )}
          </div>
        )}

        {item.media && (
          <div className="image-placeholder">
            <div className="image-label">{item.media}</div>
          </div>
        )}

        {isDeepDive && item.pills && (
          <div className="pill-grid">
            {item.pills.map((pill) => (
              <span className="info-pill" key={pill}>
                {pill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Experience() {
  const ids = useMemo(
    () => ['experience', ...timelineData.map((_, i) => `exp-${i}`)],
    []
  );
  const activeId = useActiveSection(ids);
  const activeIndex = Math.max(
    0,
    timelineData.findIndex((_, i) => activeId === `exp-${i}`)
  );

  return (
    <Section id="experience">
      <div className="section-head">
        <div className="eyebrow">Experience & Projects</div>
        <h2 className="section-title">
          A timeline built like a B2B product story
        </h2>
        <p className="section-copy">
          Strategy, finance, enterprise dealmaking, and operator muscle —
          presented as a scrollable track instead of a dead resume. Because PDFs
          are where charisma goes to die.
        </p>
      </div>

      <div className="experience-layout">
        <Timeline activeIndex={activeIndex} />
        <div className="experience-list">
          {timelineData.map((item, index) => (
            <section
              id={`exp-${index}`}
              key={item.title}
              className="milestone-anchor"
            >
              {index === 1 && <SeatGeekGraph activeIndex={activeIndex} />}
              <ExperienceSection
                item={item}
                index={index}
                activeIndex={activeIndex}
              />
            </section>
          ))}
        </div>
      </div>
    </Section>
  );
}

function SeatGeekGraph({ activeIndex }) {
  const progress = Math.min(Math.max((activeIndex - 1 + 1) / 5, 0), 1);

  return (
    <div className="graph-card glass">
      <div className="graph-header">
        <div>
          <div className="mini-kicker">SeatGeek tenure</div>
          <h3>ARR vs Enterprise ARR growth arc</h3>
        </div>
        <div className="graph-legend">
          <span>
            <i className="legend green"></i> SeatGeek ARR
          </span>
          <span>
            <i className="legend blue"></i> Enterprise ARR
          </span>
        </div>
      </div>

      <div className="graph-area">
        <div className="y-label">ARR</div>
        <div className="x-label">Time</div>

        <svg
          viewBox="0 0 100 100"
          className="graph-svg"
          preserveAspectRatio="none"
        >
          <line x1="8" y1="90" x2="95" y2="90" className="axis" />
          <line x1="8" y1="90" x2="8" y2="10" className="axis" />

          <path
            d="M 10 85 C 22 82, 28 76, 35 68 S 57 48, 66 35 S 82 18, 92 10"
            className="curve curve-bg green"
          />
          <path
            d="M 10 85 C 22 82, 28 76, 35 68 S 57 48, 66 35 S 82 18, 92 10"
            className="curve green animate-draw"
            style={{ '--drawProgress': progress }}
          />
          <path
            d="M 10 87 C 22 86, 30 82, 38 77 S 58 60, 67 49 S 82 36, 92 27"
            className="curve curve-bg blue"
          />
          <path
            d="M 10 87 C 22 86, 30 82, 38 77 S 58 60, 67 49 S 82 36, 92 27"
            className="curve blue dotted animate-draw"
            style={{ '--drawProgress': progress }}
          />

          {graphPoints.map((p, i) => (
            <g key={p.year}>
              <circle
                cx={18 + i * 18}
                cy={90 - p.seatGeek * 0.75}
                r="1.8"
                className={`point ${activeIndex >= i + 1 ? 'active' : ''}`}
              />
            </g>
          ))}
        </svg>

        <div className="graph-points">
          {graphPoints.map((p, i) => (
            <div
              className={`graph-point-card ${
                activeIndex >= i + 1 ? 'visible' : ''
              }`}
              key={p.year}
            >
              <div className="point-year">{p.year}</div>
              <div className="point-title">{p.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LovablePlaceholder() {
  return (
    <Section id="lovable">
      <div className="section-head">
        <div className="eyebrow">Strategic Partnerships @ Lovable</div>
        <h2 className="section-title">How I’d think about the role on day 0</h2>
        <p className="section-copy">
          Placeholder section for my take on commercial structure, margin
          drivers, usage economics, and negotiation posture across ecosystem
          partners.
        </p>
      </div>

      <div className="three-up">
        <div className="idea-card glass">
          <div className="idea-icon">◎</div>
          <h3>Hyperscalers</h3>
          <p>
            Hosting economics, spend commitments, credits, scaling thresholds,
            and leverage points.
          </p>
        </div>
        <div className="idea-card glass">
          <div className="idea-icon">✦</div>
          <h3>LLM providers</h3>
          <p>
            Model mix, routing strategy, unit-cost optimization, exclusivity
            risk, and roadmap alignment.
          </p>
        </div>
        <div className="idea-card glass">
          <div className="idea-icon">♥</div>
          <h3>Platforms</h3>
          <p>
            Distribution, ecosystem incentives, user acquisition, workflow
            embed, and strategic channel risk.
          </p>
        </div>
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <Section id="contact" className="contact-section">
      <div className="contact-card glass">
        <div className="eyebrow">Thanks for reading</div>
        <h2 className="section-title">
          If this feels unusually thoughtful for a job application, good.
        </h2>
        <p className="section-copy">
          I care about how businesses grow, how software gets built, and how
          partnerships actually work in practice.
        </p>
        <a className="btn btn-primary" href="mailto:brianlei22@gmail.com">
          Let’s connect
        </a>
      </div>
    </Section>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />
      <Intro />
      <Experience />
      <LovablePlaceholder />
      <Contact />
    </div>
  );
}
