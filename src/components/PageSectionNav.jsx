import { useEffect, useMemo, useState } from 'react';
import './PageSectionNav.css';
import { pageSections } from '../data/experienceData';

function useActivePageSection(sectionIds) {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;

      const viewportCenter = window.innerHeight * 0.42;
      let bestSection = sectionIds[0];
      let bestDistance = Number.POSITIVE_INFINITY;

      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestSection = id;
        }
      });

      setActiveSection(bestSection);
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
  }, [sectionIds]);

  return activeSection;
}

export default function PageSectionNav() {
  const sectionIds = useMemo(
    () => pageSections.map((section) => section.id),
    []
  );
  const activeSection = useActivePageSection(sectionIds);

  return (
    <nav className="page-section-nav" aria-label="Page sections">
      {pageSections.map((section) => {
        const isActive = section.id === activeSection;

        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={`page-section-link ${isActive ? 'is-active' : ''}`}
          >
            <span className="page-section-tick" />
            <span className="page-section-label">{section.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
