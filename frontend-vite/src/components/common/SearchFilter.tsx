import { useState, useEffect, useRef } from 'react';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: { [key: string]: string }) => void;
  onSort: (sort: { field: string; direction: 'asc' | 'desc' }) => void;
  searchPlaceholder?: string;
  filterOptions?: { value: string; label: string }[];
  sortOptions?: { value: string; label: string }[];
  showFilter?: boolean;
  showSort?: boolean;
  className?: string;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onFilter,
  onSort,
  searchPlaceholder = '搜尋...',
  filterOptions = [],
  sortOptions = [],
  showFilter = true,
  showSort = true,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string }>({});
  const [currentSort, setCurrentSort] = useState({ field: '', direction: 'asc' as 'asc' | 'desc' });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showSortPanel, setShowSortPanel] = useState(false);
  
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // 點擊外部關閉面板
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterPanel(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };

  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    const newSort = { field, direction };
    setCurrentSort(newSort);
    onSort(newSort);
  };

  const clearFilters = () => {
    setActiveFilters({});
    onFilter({});
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  const clearSort = () => {
    setCurrentSort({ field: '', direction: 'asc' });
    onSort({ field: '', direction: 'asc' });
  };

  const clearAll = () => {
    clearSearch();
    clearFilters();
    clearSort();
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;
  const hasActiveSort = currentSort.field !== '';
  const hasActiveSearch = searchQuery !== '';

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      <div className="flex flex-col space-y-4">
        {/* 搜尋欄 */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              🔍
            </div>
            {hasActiveSearch && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 過濾和排序按鈕 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 過濾按鈕 */}
          {showFilter && (
            <div className="relative">
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  hasActiveFilters
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                🔍 過濾
                {hasActiveFilters && (
                  <span className="ml-1 px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                    {Object.keys(activeFilters).length}
                  </span>
                )}
              </button>
              
              {showFilterPanel && (
                <div ref={filterRef} className="absolute top-full mt-2 left-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">篩選條件</h3>
                  <div className="space-y-3">
                    {filterOptions.map((option) => (
                      <div key={option.value} className="flex items-center justify-between">
                        <label className="text-sm text-gray-700">{option.label}</label>
                        <select
                          value={activeFilters[option.value] || ''}
                          onChange={(e) => handleFilterChange(option.value, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="">全部</option>
                          {option.value === 'status' && (
                            <>
                              <option value="scheduled">已排班</option>
                              <option value="pending">待確認</option>
                              <option value="cancelled">已取消</option>
                              <option value="approved">已批准</option>
                              <option value="rejected">已拒絕</option>
                            </>
                          )}
                          {option.value === 'leave_type' && (
                            <>
                              <option value="事假">事假</option>
                              <option value="病假">病假</option>
                              <option value="年假">年假</option>
                              <option value="婚假">婚假</option>
                              <option value="喪假">喪假</option>
                              <option value="公假">公假</option>
                            </>
                          )}
                          {option.value === 'shift_type_id' && (
                            <>
                              <option value="早班">早班</option>
                              <option value="中班">中班</option>
                              <option value="晚班">晚班</option>
                              <option value="大夜班">大夜班</option>
                            </>
                          )}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      清除篩選
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 排序按鈕 */}
          {showSort && (
            <div className="relative">
              <button
                onClick={() => setShowSortPanel(!showSortPanel)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  hasActiveSort
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                ↕ 排序
              </button>
              
              {showSortPanel && (
                <div ref={sortRef} className="absolute top-full mt-2 left-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-48">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">排序方式</h3>
                  <div className="space-y-2">
                    {sortOptions.map((option) => (
                      <div key={option.value} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{option.label}</span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleSortChange(option.value, 'asc')}
                            className={`text-xs px-2 py-1 rounded ${
                              currentSort.field === option.value && currentSort.direction === 'asc'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => handleSortChange(option.value, 'desc')}
                            className={`text-xs px-2 py-1 rounded ${
                              currentSort.field === option.value && currentSort.direction === 'desc'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <button
                      onClick={clearSort}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      清除排序
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 清除所有按鈕 */}
          {(hasActiveSearch || hasActiveFilters || hasActiveSort) && (
            <button
              onClick={clearAll}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            >
              🔄 清除
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// 過濾工具函數
export const filterData = <T extends Record<string, any>>(
  data: T[],
  searchQuery: string,
  filters: { [key: string]: string },
  searchFields: string[] = []
): T[] => {
  return data.filter((item) => {
    // 搜尋過濾
    if (searchQuery && searchFields.length > 0) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchFields.some((field) => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(searchLower);
      });
      if (!matchesSearch) return false;
    }

    // 條件過濾
    for (const [key, value] of Object.entries(filters)) {
      if (value && item[key] !== value) {
        return false;
      }
    }

    return true;
  });
};

// 排序工具函數
export const sortData = <T extends Record<string, any>>(
  data: T[],
  sort: { field: string; direction: 'asc' | 'desc' }
): T[] => {
  if (!sort.field) return data;

  return [...data].sort((a, b) => {
    const aValue = a[sort.field];
    const bValue = b[sort.field];
    
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    return sort.direction === 'desc' ? -comparison : comparison;
  });
};
