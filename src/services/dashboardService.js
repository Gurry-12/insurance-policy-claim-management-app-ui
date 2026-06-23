// TODO: implement dashboard service


import axiosInstance from '../api/axiosInstance';
import { safeExtractArray } from '../utils/formatters';

export const getAdminStats = async () => {
  return {
    totalCustomers: await getCustomerCount().catch(() => 0),
    activePolicies: await getTotalCativePolicies().catch(() => 0),
    openClaims: await getOpenClaimsCount().catch(() => 0),
    activeUsers: await getActiveUsers().catch(() => 0),
    totalProducts: await getTotalProducts().catch(() => 0),
    recentClaims: await getRecentClaims().catch(() => []),
    recentPolicies: await getRecentPolicies().catch(() => [])
  };
};


const getOpenClaimsCount = async () => {
  const response = await axiosInstance.get('/claims');
  return safeExtractArray(response).length;
};

const getTotalProducts = async () => {
  const response = await axiosInstance.get('/products/active');
  return safeExtractArray(response).length;
};

const getActiveUsers = async () => {
  const response = await axiosInstance.get('/users');
  return safeExtractArray(response).length;
};

const getCustomerCount = async () =>  {
  const response = await axiosInstance.get("/customers");
  return safeExtractArray(response).length;
};

const getTotalCativePolicies = async () => {
  const response = await axiosInstance.get('/plans/active');
  return safeExtractArray(response).length;
};

const getRecentClaims = async () => {
  const response = await axiosInstance.get('/claims');
  const list = safeExtractArray(response);
  return list.slice(0, 5).map(c => ({
    id: c.id || c.claimId || 'N/A',
    customerName: c.customerName ,
    type: c.claimType || c.type || 'Claim',
    date: c.dateFiled || c.date || c.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    status: c.claimStatus 
  }));
};

const getRecentPolicies = async () => {
  const response = await axiosInstance.get('/policies');
  const list = safeExtractArray(response);
  return list.slice(0, 5).map((p) => ({
    id: p.id || p.policyId || "N/A",
    customerName:
      p.customerName,
    productName: p.productName || p.planName || (p.plan ? p.plan.name : "Plan"),
    premium: p.premiumAmount,
    status: p.policyStatus,
    startDate:
      p.startDate ||
      p.createdAt?.split("T")[0] ||
      new Date().toISOString().split("T")[0],
  }));
};

export default getAdminStats;
