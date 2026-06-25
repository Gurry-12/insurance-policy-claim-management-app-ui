// TODO: Date, currency, and text formatter helpers

export const safeExtractArray = (response) => {
  if (!response || !response.data) return [];
  
  // If response is a string (e.g. HTML error page), it is not a valid list
  if (typeof response.data === 'string') return [];
  
  const list = response.data.content || response.data.data || response.data;
  return Array.isArray(list) ? list : [];
};

export const safeExtractPaginated = (response) => {
  if (!response || !response.data) return { content: [], totalPages: 1, totalElements: 0 };
  
  if (typeof response.data === 'string') return { content: [], totalPages: 1, totalElements: 0 };
  
  const dataObj = response.data.data || response.data;
  
  if (dataObj && typeof dataObj === 'object') {
    const content = dataObj.content || dataObj.data || (Array.isArray(dataObj) ? dataObj : []);
    const totalPages = dataObj.totalPages || 1;
    const totalElements = dataObj.totalElements ?? dataObj.totalRecords ?? content.length;
    return {
      content: Array.isArray(content) ? content : [],
      totalPages,
      totalElements
    };
  }
  
  const list = Array.isArray(response.data) ? response.data : [];
  return {
    content: list,
    totalPages: 1,
    totalElements: list.length
  };
};