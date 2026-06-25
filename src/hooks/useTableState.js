import { useState, useEffect } from 'react';
import usePagination from './usePagination';

const useTableState = ({ initialSortBy = 'id', initialSortDirection = 'asc', initialFilters = {} } = {}) => {
  const pagination = usePagination(1, 10);
  
  // Sorting
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortDirection, setSortDirection] = useState(initialSortDirection);
  
  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Generic Filters
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (updates) => {
    setFilters(prev => ({ ...prev, ...updates }));
    pagination.setCurrentPage(1);
  };
  
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    pagination.setCurrentPage(1);
  };

  const getQueryParams = () => {
    const params = {
      ...pagination.pageParams,
      sortBy,
      sortDirection,
      ...filters
    };
    if (debouncedSearch) {
      params.search = debouncedSearch;
      params.keyword = debouncedSearch;
    }
    return params;
  };

  const getSrNo = (index) => {
    if (sortDirection === 'desc' && pagination.totalElements > 0) {
      return pagination.totalElements - ((pagination.currentPage - 1) * pagination.pageSize + index);
    }
    return (pagination.currentPage - 1) * pagination.pageSize + index + 1;
  };

  return {
    ...pagination, // currentPage, setCurrentPage, totalPages, setTotalPages, etc.
    sortBy,
    sortDirection,
    handleSort,
    searchQuery,
    debouncedSearch,
    handleSearchChange,
    filters,
    handleFilterChange,
    getQueryParams,
    getSrNo
  };
};

export default useTableState;
