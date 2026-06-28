import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import StatusBadge from '../../../components/ui/StatusBadge';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import { getClaimHistory, getClaimById } from '../../../services/claimService';

const AdminClaimHistoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    Promise.all([
      getClaimById(id).catch(() => null),
      getClaimHistory(id).catch(() => [])
    ])
      .then(([claimData, historyData]) => {
        if (!claimData) {
          setError('Claim details could not be found.');
        } else {
          setClaim(claimData);
          setHistory(historyData?.content || historyData?.data || (Array.isArray(historyData) ? historyData : []));
        }
      })
      .catch((err) => {
        setError(err.message || 'Could not load claim history.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Loading claim history..." />;
  }

  if (error || !claim) {
    return (
      <div>
        <PageHeader 
          title="Claim History" 
          subtitle="Viewing status logs"
          onBack={() => navigate('/admin/claims')}
        />
        <ErrorAlert message={error || 'History details not found.'} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <PageHeader 
        title="Claim Status History" 
        subtitle={`Audit logs for Claim #${claim.claimNumber || id}`}
        onBack={() => navigate(`/admin/claims/${id}`)}
      />

      <div className="card border-0" style={{ borderRadius: 16, boxShadow: 'var(--ss-shadow)' }}>
        <div className="card-body p-4">
          <h6 className="fw-bold mb-4">Transition Timeline</h6>

          {history.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-clock-history d-block fs-2 mb-2"></i>
              No status log entries recorded for this claim.
            </div>
          ) : (
            <div className="timeline-container">
              {history.map((log, idx) => (
                <div key={idx} className="d-flex gap-3 mb-4 align-items-start">
                  <div className="timeline-badge-wrapper d-flex flex-column align-items-center">
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <i className="bi bi-clock"></i>
                    </div>
                    {idx < history.length - 1 && (
                      <div style={{ width: 2, height: 50, backgroundColor: 'var(--ss-border-light)', margin: '4px 0' }}></div>
                    )}
                  </div>
                  <div className="card border-0 p-3 bg-light w-100" style={{ borderRadius: 12 }}>
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                      <div className="d-flex gap-2 align-items-center">
                        <StatusBadge status={log.status || log.newStatus} />
                      </div>
                      <small className="text-muted">{(log.updatedDate || log.date)?.replace('T', ' ')}</small>
                    </div>
                    <p className="mb-0 text-secondary" style={{ fontSize: '0.85rem' }}>
                      Updated by <strong className="text-dark">{log.updatedBy || 'System'}</strong>
                    </p>
                    {log.remarks && (
                      <div className="mt-2 p-2 bg-white rounded border-start border-primary border-3" style={{ fontSize: '0.8rem' }}>
                        <strong>Remarks:</strong> {log.remarks}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminClaimHistoryPage;
