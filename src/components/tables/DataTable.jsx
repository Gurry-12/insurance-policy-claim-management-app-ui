
import EmptyState from '../ui/EmptyState';
import LoadingSpinner from '../common/LoadingSpinner';

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
      <div className="d-flex justify-content-center p-5">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState icon={emptyIcon} message={emptyMessage} />;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ color: 'var(--ss-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {columns.map((col, idx) => (
              <th key={idx} className="border-0" style={{ minWidth: col.minWidth }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={row.id || rowIndex} 
              onClick={() => onRowClick && onRowClick(row)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.cell ? col.cell(row) : row[col.accessor]}
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
