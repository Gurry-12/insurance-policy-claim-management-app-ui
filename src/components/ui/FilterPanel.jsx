import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * FilterPanel — Enterprise-grade floating filter panel
 *
 * Props:
 *   fields        — Array of filter field config objects (see below)
 *   localFilters  — Current filter values from useDebounceFilters
 *   onApply       — Called with validated updates to apply (calls handleFilterChange)
 *   onClear       — Called to reset all filters (calls clearFilters)
 *
 * Field Config Types:
 *   { type: 'text',         name, label, placeholder }
 *   { type: 'select',       name, label, options: [{value, label}] }
 *   { type: 'date-range',   startName, endName, label }
 *   { type: 'amount-range', minName, maxName, label }
 */

const DATE_PRESETS = [
  { label: 'Today',      getDates: () => { const d = today(); return { start: d, end: d }; } },
  { label: 'Yesterday',  getDates: () => { const d = daysAgo(1); return { start: d, end: d }; } },
  { label: 'Last 7 Days',  getDates: () => ({ start: daysAgo(6), end: today() }) },
  { label: 'Last 30 Days', getDates: () => ({ start: daysAgo(29), end: today() }) },
  { label: 'This Month',   getDates: () => ({ start: startOfMonth(), end: today() }) },
  { label: 'Last Month',   getDates: () => ({ start: startOfLastMonth(), end: endOfLastMonth() }) },
];

const fmt = (d) => d.toISOString().split('T')[0];
const today = () => fmt(new Date());
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return fmt(d); };
const startOfMonth = () => { const d = new Date(); d.setDate(1); return fmt(d); };
const startOfLastMonth = () => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - 1); return fmt(d); };
const endOfLastMonth = () => { const d = new Date(); d.setDate(0); return fmt(d); };

const countActiveFilters = (fields, filters) => {
  let count = 0;
  fields.forEach(f => {
    if (f.type === 'date-range') {
      if (filters[f.startName] && filters[f.endName]) count++;
    } else if (f.type === 'amount-range') {
      if (filters[f.minName] && filters[f.maxName]) count++;
    } else if (f.name && filters[f.name]) {
      count++;
    }
  });
  return count;
};

const FilterPanel = ({ fields = [], localFilters, onApply, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState({});
  const [errors, setErrors] = useState({});
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  const activeCount = countActiveFilters(fields, localFilters);

  // Sync draft with applied filters when panel opens
  const openPanel = () => {
    setDraft({ ...localFilters });
    setErrors({});
    setIsOpen(true);
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  const updateDraft = useCallback((name, value) => {
    setDraft(prev => ({ ...prev, [name]: value }));
    // Clear error for the group this field belongs to
    setErrors(prev => {
      const next = { ...prev };
      fields.forEach(f => {
        if (f.type === 'date-range' && (name === f.startName || name === f.endName)) delete next[f.label];
        if (f.type === 'amount-range' && (name === f.minName || name === f.maxName)) delete next[f.label];
      });
      return next;
    });
  }, [fields]);

  const validate = useCallback(() => {
    const errs = {};
    fields.forEach(f => {
      if (f.type === 'date-range') {
        const s = draft[f.startName], e = draft[f.endName];
        if ((s && !e) || (!s && e)) {
          errs[f.label] = 'Please select both Start Date and End Date.';
        } else if (s && e && e < s) {
          errs[f.label] = 'End Date cannot be before Start Date.';
        }
      }
      if (f.type === 'amount-range') {
        const mn = draft[f.minName], mx = draft[f.maxName];
        if ((mn !== '' && mn !== undefined && (mx === '' || mx === undefined)) ||
            (mx !== '' && mx !== undefined && (mn === '' || mn === undefined))) {
          errs[f.label] = 'Please enter both Minimum and Maximum Amount.';
        } else if (mn && mx && Number(mx) <= Number(mn)) {
          errs[f.label] = 'Maximum Amount must be greater than Minimum Amount.';
        }
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [fields, draft]);

  const handleApply = () => {
    if (!validate()) return;
    onApply(draft);
    setIsOpen(false);
  };

  const handleClear = () => {
    const cleared = {};
    fields.forEach(f => {
      if (f.type === 'date-range') { cleared[f.startName] = ''; cleared[f.endName] = ''; }
      else if (f.type === 'amount-range') { cleared[f.minName] = ''; cleared[f.maxName] = ''; }
      else cleared[f.name] = '';
    });
    setDraft(cleared);
    setErrors({});
    onClear();
    setIsOpen(false);
  };

  const applyDatePreset = (preset) => {
    const dateField = fields.find(f => f.type === 'date-range');
    if (!dateField) return;
    const { start, end } = preset.getDates();
    setDraft(prev => ({ ...prev, [dateField.startName]: start, [dateField.endName]: end }));
    setErrors(prev => { const n = { ...prev }; delete n[dateField.label]; return n; });
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="ip-filter-wrapper" style={{ position: 'relative' }}>
      {/* Trigger Button */}
      <button
        ref={btnRef}
        className={`ip-filter-trigger btn ${isOpen || activeCount > 0 ? 'ip-filter-trigger--active' : 'ip-filter-trigger--idle'}`}
        onClick={isOpen ? () => setIsOpen(false) : openPanel}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Filter options${activeCount > 0 ? `, ${activeCount} active` : ''}`}
      >
        <i className="bi bi-sliders2" />
        <span>Filters</span>
        {activeCount > 0 && (
          <span className="ip-filter-badge" aria-label={`${activeCount} active filters`}>
            {activeCount}
          </span>
        )}
        <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'} ip-filter-chevron`} />
      </button>

      {/* Floating Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="ip-filter-panel"
          role="dialog"
          aria-label="Filter Options"
        >
          {/* Panel Header */}
          <div className="ip-filter-panel-header">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-funnel-fill" style={{ color: 'var(--ip-brand)' }} />
              <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>Advanced Filters</span>
            </div>
            <button
              className="btn-close btn-close-sm"
              onClick={() => setIsOpen(false)}
              aria-label="Close filter panel"
              style={{ width: 20, height: 20 }}
            />
          </div>

          {/* Date Presets (if date-range field exists) */}
          {fields.some(f => f.type === 'date-range') && (
            <div className="ip-filter-presets">
              <span className="ip-filter-presets-label">Quick Dates</span>
              <div className="ip-filter-presets-list">
                {DATE_PRESETS.map(p => (
                  <button
                    key={p.label}
                    className="ip-filter-preset-chip"
                    onClick={() => applyDatePreset(p)}
                    type="button"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filter Fields Grid */}
          <div className="ip-filter-body">
            {fields.map((field, i) => {
              if (field.type === 'text') {
                return (
                  <div key={i} className="ip-filter-field">
                    <label className="ip-filter-label" htmlFor={`fp-${field.name}`}>{field.label}</label>
                    <div className="ip-filter-input-wrap">
                      <i className="bi bi-search ip-filter-input-icon" />
                      <input
                        id={`fp-${field.name}`}
                        type="text"
                        className="form-control ip-filter-input"
                        placeholder={field.placeholder || `Search ${field.label}...`}
                        value={draft[field.name] || ''}
                        onChange={e => updateDraft(field.name, e.target.value)}
                        autoComplete="off"
                      />
                      {draft[field.name] && (
                        <button
                          className="ip-filter-input-clear"
                          onClick={() => updateDraft(field.name, '')}
                          aria-label={`Clear ${field.label}`}
                          type="button"
                        >
                          <i className="bi bi-x" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              }

              if (field.type === 'select') {
                return (
                  <div key={i} className="ip-filter-field">
                    <label className="ip-filter-label" htmlFor={`fp-${field.name}`}>{field.label}</label>
                    <select
                      id={`fp-${field.name}`}
                      className="form-select ip-filter-input"
                      value={draft[field.name] || ''}
                      onChange={e => updateDraft(field.name, e.target.value)}
                    >
                      <option value="">All {field.label}s</option>
                      {field.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (field.type === 'date-range') {
                const hasErr = errors[field.label];
                return (
                  <div key={i} className="ip-filter-field ip-filter-field--wide">
                    <label className="ip-filter-label">{field.label}</label>
                    <div className="ip-filter-range-row">
                      <div className="ip-filter-range-group">
                        <span className="ip-filter-range-label">From</span>
                        <input
                          type="date"
                          className={`form-control ip-filter-input${hasErr ? ' is-invalid' : ''}`}
                          value={draft[field.startName] || ''}
                          onChange={e => updateDraft(field.startName, e.target.value)}
                          aria-label="Start date"
                          max={draft[field.endName] || undefined}
                        />
                      </div>
                      <i className="bi bi-arrow-right ip-filter-range-arrow" />
                      <div className="ip-filter-range-group">
                        <span className="ip-filter-range-label">To</span>
                        <input
                          type="date"
                          className={`form-control ip-filter-input${hasErr ? ' is-invalid' : ''}`}
                          value={draft[field.endName] || ''}
                          onChange={e => updateDraft(field.endName, e.target.value)}
                          aria-label="End date"
                          min={draft[field.startName] || undefined}
                        />
                      </div>
                    </div>
                    {hasErr && <div className="ip-filter-error"><i className="bi bi-exclamation-circle me-1" />{hasErr}</div>}
                  </div>
                );
              }

              if (field.type === 'amount-range') {
                const hasErr = errors[field.label];
                return (
                  <div key={i} className="ip-filter-field ip-filter-field--wide">
                    <label className="ip-filter-label">{field.label}</label>
                    <div className="ip-filter-range-row">
                      <div className="ip-filter-range-group">
                        <span className="ip-filter-range-label">Min (₹)</span>
                        <input
                          type="number"
                          className={`form-control ip-filter-input${hasErr ? ' is-invalid' : ''}`}
                          placeholder="0"
                          value={draft[field.minName] || ''}
                          onChange={e => updateDraft(field.minName, e.target.value)}
                          min="0"
                          aria-label="Minimum amount"
                        />
                      </div>
                      <i className="bi bi-dash ip-filter-range-arrow" />
                      <div className="ip-filter-range-group">
                        <span className="ip-filter-range-label">Max (₹)</span>
                        <input
                          type="number"
                          className={`form-control ip-filter-input${hasErr ? ' is-invalid' : ''}`}
                          placeholder="Any"
                          value={draft[field.maxName] || ''}
                          onChange={e => updateDraft(field.maxName, e.target.value)}
                          min="0"
                          aria-label="Maximum amount"
                        />
                      </div>
                    </div>
                    {hasErr && <div className="ip-filter-error"><i className="bi bi-exclamation-circle me-1" />{hasErr}</div>}
                  </div>
                );
              }

              return null;
            })}
          </div>

          {/* Panel Footer Actions */}
          <div className="ip-filter-panel-footer">
            <button
              className="btn ip-filter-btn-reset"
              onClick={handleClear}
              type="button"
            >
              <i className="bi bi-arrow-counterclockwise me-1" />
              Reset
            </button>
            <button
              className={`btn ip-filter-btn-apply${hasErrors ? ' disabled' : ''}`}
              onClick={handleApply}
              disabled={hasErrors}
              type="button"
            >
              <i className="bi bi-check2 me-1" />
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
