import { Shield, Clock, IndianRupee } from 'lucide-react';

const PremiumBreakdownCard = ({ quoteDetails }) => {
  if (!quoteDetails) return null;

  return (
    <div className="border-0 rounded-3 overflow-hidden" style={{ boxShadow: 'var(--ip-shadow-sm)' }}>
      {/* Header with coverage info */}
      {(quoteDetails.selectedCoverage || quoteDetails.coverageAmount) && (
        <div className="p-3" style={{ backgroundColor: 'var(--ip-brand-light, #f0f9ff)', borderBottom: '1px solid var(--ip-brand-muted, #e0f2fe)' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <Shield size={16} className="text-primary" />
              <span className="small text-muted">Coverage</span>
              <span className="fw-bold text-primary">
                ₹{(quoteDetails.selectedCoverage || quoteDetails.coverageAmount || 0).toLocaleString('en-IN')}
              </span>
            </div>
            {(quoteDetails.duration || quoteDetails.term) && (
              <div className="d-flex align-items-center gap-2">
                <Clock size={16} className="text-muted" />
                <span className="small text-muted">Term</span>
                <span className="fw-bold">{quoteDetails.duration || quoteDetails.term} Year(s)</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Premium breakdown */}
      <div className="p-3 bg-white">
        <h6 className="fw-bold mb-3 border-bottom pb-2">
          <IndianRupee size={14} className="me-1" />
          Premium Breakdown
        </h6>
        
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="text-muted small">Base Premium</span>
          <span className="fw-semibold">
            ₹{(quoteDetails.annualPremium || quoteDetails.basePremium || 0).toLocaleString('en-IN')}
          </span>
        </div>
        
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="text-muted small">Processing Fee</span>
          <span className="fw-semibold">
            ₹{(quoteDetails.processingFee || 0).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="text-muted small">GST</span>
          <span className="fw-semibold">
            ₹{(quoteDetails.gst || quoteDetails.taxAmount || 0).toLocaleString('en-IN')}
          </span>
        </div>

        {(quoteDetails.discountAmount > 0 || quoteDetails.oneTimeDiscount > 0) && (
          <div className="d-flex align-items-center justify-content-between mb-2 text-success">
            <span className="small">Discount</span>
            <span className="fw-semibold">
              - ₹{(quoteDetails.discountAmount || quoteDetails.oneTimeDiscount || 0).toLocaleString('en-IN')}
            </span>
          </div>
        )}

        <hr className="my-2" />
        
        <div className="d-flex align-items-center justify-content-between">
          <span className="fw-bold">Total Premium</span>
          <span className="fw-bold text-primary fs-5">
            ₹{(quoteDetails.finalPremium || quoteDetails.totalPremium || 0).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PremiumBreakdownCard;
