export default function ExperienceMilestoneCard({
  item,
  index,
  isActive,
  isPassed,
  className = '',
  showYear = false,
}) {
  const hasMediaPlaceholder = typeof item.media === 'string' && item.media.length > 0;

  return (
    <article
      className={`journey-step-card glass ${className} ${
        isActive ? 'is-active' : ''
      } ${isPassed ? 'is-passed' : ''}`}
    >
      <div className="journey-step-topline">
        <span className="journey-step-index">
          {String(index + 1).padStart(2, '0')}
        </span>
        {showYear && <span className="journey-step-year">{item.year}</span>}
        <span className="journey-step-phase">{item.phaseLabel}</span>
      </div>

      <h3>{item.title}</h3>
      <p>{item.body}</p>
      {item.sub && <p className="journey-step-subcopy">{item.sub}</p>}

      {(item.arr || item.enterprise) && (
        <div className="journey-metric-grid">
          {item.arr && (
            <div className="journey-metric-card">
              <span>SeatGeek ARR</span>
              <strong>{item.arr}</strong>
            </div>
          )}
          {item.enterprise && (
            <div className="journey-metric-card">
              <span>Enterprise ARR</span>
              <strong>{item.enterprise}</strong>
            </div>
          )}
        </div>
      )}

      {hasMediaPlaceholder && (
        <div className="journey-image-placeholder">
          <div className="journey-image-label">{item.media}</div>
        </div>
      )}

      {item.pills && (
        <div className="journey-pill-grid">
          {item.pills.map((pill) => (
            <span className="journey-info-pill" key={pill}>
              {pill}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
