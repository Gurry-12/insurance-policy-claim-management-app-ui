import EmptyState from '../ui/EmptyState';

const DataTable = ({
  columns,
  data,
  loading = false,
  onRowClick,
  emptyIcon = "bi-table",
  emptyMessage = "No data available",
  compact = false
}) => {

  if (loading) {
    return (
      <div className="table-responsive" style={compact ? {} : { minHeight: '440px' }}>
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="border-0"><span className="placeholder col-6"></span></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((_, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((_, colIndex) => (
                  <td key={colIndex}>
                    <span className="placeholder col-8 placeholder-glow"></span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center py-4" style={compact ? { width: '100%' } : { minHeight: '440px', width: '100%' }}>
        <EmptyState icon={emptyIcon} message={emptyMessage} />
      </div>
    );
  }

  return (
    <div className="table-responsive" style={compact ? { overflowY: 'auto' } : { minHeight: '440px', maxHeight: '600px', overflowY: 'auto' }}>
      <table className={`table table-hover align-middle mb-0 ${compact ? 'table-sm' : ''}`} style={compact ? { fontSize: '0.85rem' } : {}}>
        <thead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'var(--ip-body-bg, #fff)' }}>
          <tr>
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className="border-0 bg-white" 
                style={{ minWidth: col.minWidth }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="animate-slide-up">
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              onKeyDown={(e) => {
                if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onRowClick(row);
                }
              }}
              tabIndex={onRowClick ? 0 : undefined}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              role="row"
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.cell ? col.cell(row, rowIndex) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
