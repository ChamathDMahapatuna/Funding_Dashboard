import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

function AdvancedSearchBar({ 
  data, 
  onResultClick,
  searchableFields = ['Name', 'Technology', 'City', 'State'], 
  placeholder = "Search...", 
  className = "",
  resultsLimit = 10
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const debounceTimeout = useRef(null);

  // Handle the search input change with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear any existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set a new timeout to delay the search execution
    debounceTimeout.current = setTimeout(() => {
      if (value.trim()) {
        performSearch(value);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300); // 300ms debounce time
  };

  // Perform search across specified fields
  const performSearch = (term) => {
    if (!data || !Array.isArray(data)) return;
    
    const searchTermLower = term.toLowerCase();
    
    const results = data.filter(item => {
      return searchableFields.some(field => {
        // Handle nested fields like Avg[' Funding/Year']
        if (field.includes('.')) {
          const parts = field.split('.');
          let value = item;
          for (const part of parts) {
            value = value?.[part];
          }
          return value?.toString().toLowerCase().includes(searchTermLower);
        }
        
        return item[field]?.toString().toLowerCase().includes(searchTermLower);
      });
    }).slice(0, resultsLimit);
    
    setSearchResults(results);
  };

  // Handle selecting a result
  const handleResultSelect = (result) => {
    if (onResultClick) {
      onResultClick(result);
    }
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
  };

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(e.target) && 
        resultsRef.current && 
        !resultsRef.current.contains(e.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  // Handle keyboard shortcuts and navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl+/ or Cmd+/ to focus the search
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  // Format display of result item
  const formatResultItem = (result) => {
    return (
      <div className="flex justify-between items-center w-full">
        <div>
          <div className="font-medium">{result.Name || 'Unnamed'}</div>
          <div className="text-sm text-gray-500">{result.Technology || 'No technology'}</div>
        </div>
        <div className="text-sm text-gray-500">
          {result.City && result.State ? `${result.City}, ${result.State}` : result.City || result.State || ''}
        </div>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={searchRef}
        className={`flex items-center bg-white rounded-lg border ${isFocused ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-300'} px-3 py-2 transition-all duration-150`}
      >
        <FaSearch className={`mr-2 ${isFocused ? 'text-blue-500' : 'text-gray-500'}`} />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => {
            setIsFocused(true);
            if (searchTerm.trim()) setShowResults(true);
          }}
          onBlur={() => setIsFocused(false)}
          className="w-full outline-none bg-transparent"
          aria-label="Advanced search"
        />
        {searchTerm && (
          <button 
            onClick={clearSearch}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <FaTimes />
          </button>
        )}
      </div>
      <div className="absolute right-3 top-2 text-xs text-gray-400 pointer-events-none">
        {isFocused && <span>Ctrl + /</span>}
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div 
          ref={resultsRef}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-80 overflow-y-auto"
        >
          {searchResults.map((result, index) => (
            <button
              key={index}
              onClick={() => handleResultSelect(result)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
            >
              {formatResultItem(result)}
            </button>
          ))}
        </div>
      )}
      {showResults && searchTerm.trim() !== '' && searchResults.length === 0 && (
        <div 
          className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 p-4 text-center text-gray-500"
        >
          No matches found for "{searchTerm}"
        </div>
      )}
    </div>
  );
}

export default AdvancedSearchBar;
