/**
 * PageHeader — standard page title + subtitle row used at the top of every page.
 *
 * Props:
 *  title    — main heading string
 *  subtitle — secondary line (optional)
 *  action   — right-side node, e.g. a button (optional)
 */
const PageHeader = ({ title, subtitle, action }) => (
  <div className="d-flex align-items-start justify-content-between mb-4 gap-3">
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--ss-text-primary)', margin: 0 }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontSize: '0.85rem', color: 'var(--ss-text-muted)', margin: '2px 0 0' }}>
          {subtitle}
        </p>
      )}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

export default PageHeader;
