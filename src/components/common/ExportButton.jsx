import { exportToCSV } from '../../utils/exportUtils';

const ExportButton = ({ data, columns, filename = "export.csv", label = "Export to CSV" }) => {
  const handleExport = () => {
    exportToCSV(data, columns, filename);
  };

  return (
    <button 
      onClick={handleExport} 
      className="btn btn-outline-primary d-inline-flex align-items-center gap-2"
      style={{
        borderRadius: '8px',
        padding: '0.4rem 0.8rem',
        fontSize: '0.85rem',
        fontWeight: 500,
        transition: 'all 0.25s ease'
      }}
    >
      <i className="bi bi-download"></i>
      <span>{label}</span>
    </button>
  );
};

export default ExportButton;
