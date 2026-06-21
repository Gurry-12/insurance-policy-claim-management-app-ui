import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { recordPayment } from "../../../services/paymentService";

const RecordPaymentPage = () => {
  const navigate = useNavigate();
  const { policyId } = useParams();

  const [formData, setFormData] = useState({
    policyId: policyId || "",
    amount: "",
    paymentMode: "UPI",
    paymentStatus: "SUCCESS",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await recordPayment({
        ...formData,
        amount: Number(formData.amount),
      });

      alert("Payment Recorded Successfully");

      navigate("/customer/payments");
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          "Payment Failed"
      );
    }
  };

  return (
    <div className="container mt-4">
      <h3>Make Payment</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Policy Id</label>
          <input
            type="number"
            name="policyId"
            className="form-control"
            value={formData.policyId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            className="form-control"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Payment Mode</label>

          <select
            name="paymentMode"
            className="form-control"
            value={formData.paymentMode}
            onChange={handleChange}
          >
            <option value="UPI">UPI</option>
            <option value="CARD">CARD</option>
            <option value="NET_BANKING">NET_BANKING</option>
            <option value="CASH">CASH</option>
          </select>
        </div>

        <button className="btn btn-success">
          Pay Premium
        </button>
      </form>
    </div>
  );
};

export default RecordPaymentPage;