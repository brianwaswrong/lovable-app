import ExperienceJourney from './components/ExperienceJourney';
import PageSectionNav from './components/PageSectionNav';
import AIModelSupplyPortfolio from './components/AIModelSupplyPortfolio';
import lovableLogo from './assets/lovable_logo.png';

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
        <div className="hero-copy-stack">
          <div className="eyebrow hero-reveal hero-reveal-1">Built for Lovable's Finance & BizOps Partnerships role</div>
          <h1 className="hero-title hero-reveal hero-reveal-2">
            Hi - I&apos;m <span className="accent">Brian.</span>
          </h1>
          <p className="hero-subtitle hero-reveal hero-reveal-3">
            I'm applying to join Andy & Matias' team at  <span className="accent-soft">Lovable</span>. In ~1 min, I hope this <span className="accent-soft">app</span> shows my fit & thinking, deep care for democratizing software, & how I'd attack Day 0.
            {/* Enterprise partnerships division from{' '}
            <span className="accent-soft">$3M to $200M</span> in five
            years. */}
          </p>
          {/* <p className="hero-body">
            Today I run my own consulting practice and build AI-enabled software
            for SMBs, independent cafes, and venues - with 10 clients and
            6-figure ARR in under 3 months.
          </p> */}

          <div className="hero-actions hero-reveal hero-reveal-4">
            <a href="mailto:brianlei22@gmail.com" className="btn btn-primary">
              Email Brian
            </a>
            <a href="#experience" className="btn btn-secondary">
              View timeline
            </a>
          </div>
        </div>

        <div className="hero-card glass hero-reveal hero-reveal-5">
          <div className="mini-kicker">My fit</div>
          <div className="stat-row">
            <span>✅ BizOps/StratFin founder</span>
            <strong>$100M → $900M ARR scale</strong>
          </div>
          <div className="stat-row">
            <span>✅ High-Slope</span>
            <strong>New Grad → Chief-of-Staff in 5 yrs</strong>
          </div>
          <div className="stat-row">
            <span>✅ Deal Architect</span>
            <strong>Modeled 9-figure ARR partnerships</strong>
          </div>
          <div className="stat-row">
            <span>✅ AI-Native Builder</span>
            <strong>Using AI to ship tools for SMBs</strong>
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

function Contact() {
  return (
    <Section id="contact" className="contact-section">
      <div className="contact-card glass">
        <div className="eyebrow">Thanks for reading</div>
        <h2 className="section-title">
          I hope this is unusually thoughtful for an app.
        </h2>
        <p className="section-copy">
          The throughline: building tools for end-users I care about: prior the largest teams, artists, venues in the world and now SMBs and anyone that can imagine magical software.
        </p>
        <a className="btn btn-primary" href="mailto:brianlei22@gmail.com">
          Let&apos;s connect
        </a>
      </div>
    </Section>
  );
}

function BuildPill() {
  return (
    <div className="build-pill" role="note" aria-label="Built with Lovable x Codex">
      <span className="build-pill-kicker">Built with</span>
      <span className="build-pill-brand">
        <img className="build-pill-logo" src={lovableLogo} alt="" aria-hidden="true" />
        <span>Lovable</span>
      </span>
      <span className="build-pill-separator">x</span>
      <span className="build-pill-brand is-text-only">Codex</span>
    </div>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <PageSectionNav />
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />
      <BuildPill />
      <Intro />
      <ExperienceJourney />
      <AIModelSupplyPortfolio />
      <Contact />
    </div>
  );
}
