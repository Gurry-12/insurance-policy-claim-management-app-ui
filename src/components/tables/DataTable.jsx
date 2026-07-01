import EmptyState from '../ui/EmptyState';

const DataTable = ({
  columns,
  data,
  loading = false,
  onRowClick,
  emptyIcon = "bi-table",
  emptyMessage = "No data available"
}) => {
  if (loading) {
    return (
      <div className="table-responsive">
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
    return <EmptyState icon={emptyIcon} message={emptyMessage} />;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="border-0" style={{ minWidth: col.minWidth }}>
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
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
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
