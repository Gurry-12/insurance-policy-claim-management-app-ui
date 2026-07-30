import axiosInstance from '../api/axiosInstance';

/**
 * Fetches live platform statistics for the public landing page.
 * Falls back gracefully to default numbers if the API fails or is unreachable.
 */
export const getPlatformStats = async () => {
  try {
    const response = await axiosInstance.get('/public/stats');
    return response.data || {
      activeProducts: 4,
      activePlans: 12,
      totalPolicies: 250,
      claimsProcessed: 95,
    };
  } catch (error) {
    console.warn('Could not fetch live platform stats, using fallback default numbers:', error);
    return {
      activeProducts: 4,
      activePlans: 12,
      totalPolicies: 250,
      claimsProcessed: 95,
    };
  }
};
