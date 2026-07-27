import React, { useState } from 'react';
import { configureCoverageOptions, updateCoverageOption } from '../../services/coverageOptionService';
import { notify } from '../../utils/notificationService';

const CoverageOptionsManager = ({ planId, existingOptions = [], onUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [coverageAmount, setCoverageAmount] = useState('');
  const [label, setLabel] = useState('');
  const [displayOrder, setDisplayOrder] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCoverage = async (e) => {
    e.preventDefault();
    if (!coverageAmount || !label || !displayOrder) {
      notify.error("Please fill all coverage fields.");
      return;
    }

    setIsAdding(true);
    try {
      const payload = {
        coverageAmount: Number(coverageAmount),
        label: label,
        displayOrder: Number(displayOrder),
        activeStatus: true
      };
      
      const res = await configureCoverageOptions(planId, payload);
      notify.success("Coverage option added successfully.");
      if (onUpdate) onUpdate();
      
      setCoverageAmount('');
      setLabel('');
      setDisplayOrder('');
      setShowAddForm(false);
    } catch (error) {
      notify.error(error.message || "Failed to add coverage option.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleCoverage = async (opt) => {
    if (!opt.id && !opt.coverageOptionId) {
      notify.error("Cannot edit this option, ID missing.");
      return;
    }
    const optionId = opt.id || opt.coverageOptionId;
    try {
      const payload = {
        coverageAmount: opt.coverageAmount,
        label: opt.label,
        displayOrder: opt.displayOrder,
        activeStatus: !(opt.isActive ?? opt.active)
      };
      await updateCoverageOption(planId, optionId, payload);
      notify.success(`Coverage tier ${payload.activeStatus ? 'activated' : 'disabled'} successfully.`);
      if (onUpdate) onUpdate();
    } catch (error) {
      notify.error(error.message || "Failed to update coverage option.");
    }
  };

  return (
    <div className="card border-0 mb-4" style={{ borderRadius: 16, boxShadow: 'var(--ip-shadow-md)' }}>
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h6 className="fw-bold m-0">Coverage Configuration</h6>
          <button 
            className="btn btn-outline-primary btn-sm rounded-pill px-3" 
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : '+ Add Custom Tier'}
          </button>
        </div>

        {showAddForm && (
          <div className="p-3 bg-light rounded-3 border mb-4 fade-in">
            <h6 className="fw-semibold mb-3 fs-6">Add Custom Coverage Tier</h6>
            <form onSubmit={handleAddCoverage} className="row g-2 align-items-end">
              <div className="col-md-3">
                <label className="form-label small text-muted mb-1">Coverage Amount (₹)</label>
                <input 
                  type="number" 
                  step="1"
                  className="form-control form-control-sm" 
                  value={coverageAmount}
                  onChange={(e) => setCoverageAmount(e.target.value)}
                  placeholder="e.g. 500000"
                  onKeyDown={(e) => { if (e.key === '.' || e.key === 'e') e.preventDefault(); }}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small text-muted mb-1">Label</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. ?5 Lakhs"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small text-muted mb-1">Display Order</label>
                <input 
                  type="number" 
                  step="1"
                  className="form-control form-control-sm" 
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  placeholder="e.g. 1"
                  onKeyDown={(e) => { if (e.key === '.' || e.key === 'e') e.preventDefault(); }}
                />
              </div>
              <div className="col-md-3">
                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm w-100"
                  disabled={isAdding}
                >
                  {isAdding ? "Adding..." : "Add Coverage"}
                </button>
              </div>
            </form>
          </div>
        )}

        {existingOptions && existingOptions.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Order</th>
                  <th>Coverage</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {existingOptions
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((opt, idx) => {
                    const isActive = opt.isActive ?? opt.active;
                    return (
                      <tr key={idx}>
                        <td><span className="text-muted">#{opt.displayOrder}</span></td>
                        <td>
                          <span className="fw-semibold">
                            {opt.label || `?${((opt.coverageAmount || opt) / 100000).toLocaleString('en-IN')} Lakhs`}
                          </span>
                        </td>
                        <td>
                          {isActive ? (
                            <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">
                              <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.4rem', verticalAlign: 'middle' }}></i> Active
                            </span>
                          ) : (
                            <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-3">
                              <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.4rem', verticalAlign: 'middle' }}></i> Retired
                            </span>
                          )}
                        </td>
                        <td className="text-end">
                          <button 
                            className={`btn btn-sm ${isActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
                            style={{ width: '80px' }}
                            onClick={() => handleToggleCoverage(opt)}
                          >
                            {isActive ? 'Disable' : 'Enable'}
                          </button>
                        </td>
                      </tr>
                    );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-4 bg-light rounded-3 text-muted">
            <i className="bi bi-shield-x fs-2 d-block mb-2"></i>
            No coverage options found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverageOptionsManager;
