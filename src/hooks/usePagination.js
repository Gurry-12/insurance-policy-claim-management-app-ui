import { useState } from 'react';

export const usePagination = (initialPage = 1, initialSize = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(initialSize);

  const pageParams = {
    pageNumber: currentPage - 1,
    pageSize: pageSize,
    sortDirection: "desc"
  };

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
    totalElements,
    setTotalElements,
    pageSize,
    setPageSize,
    pageParams
  };
};

export default usePagination;
