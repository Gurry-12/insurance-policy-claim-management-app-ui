// TODO: Date, currency, and text formatter helpers

export const safeExtractArray = (response) => {
  if (!response || !response.data) return [];
  
  // If response is a string (e.g. HTML error page), it is not a valid list
  if (typeof response.data === 'string') return [];
  
  const list = response.data.content || response.data.data || response.data;
  return Array.isArray(list) ? list : [];
};