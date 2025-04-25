import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Map as MapIcon, 
  List, 
  SlidersHorizontal, 
  X,
  Home,
  Building,
  Landmark,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Grid
} from 'lucide-react';
import { mockProperties } from '../data/mockProperties';
import PropertyCard from '../components/shared/PropertyCard';
import { Property, PropertyFilters } from '../types/property';
import { cn } from '../utils/cn';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<PropertyFilters>({
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
    purpose: (searchParams.get('purpose') as 'rent' | 'buy') || undefined
  });
  
  // Initialize the search term from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  
  // Load properties
  useEffect(() => {
    // In a real app, we would fetch from an API
    setProperties(mockProperties);
  }, []);
  
  // Apply filters and search
  useEffect(() => {
    if (!properties.length) return;
    
    let result = [...properties];
    
    // Filter by search term (location or title)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        property => 
          property.location.toLowerCase().includes(term) || 
          property.title.toLowerCase().includes(term)
      );
    }
    
    // Filter by location
    if (filters.location) {
      const location = filters.location.toLowerCase();
      result = result.filter(
        property => property.location.toLowerCase().includes(location)
      );
    }
    
    // Filter by property type
    if (filters.type) {
      result = result.filter(
        property => property.propertyType === filters.type
      );
    }
    
    // Filter by price range
    if (filters.minPrice) {
      result = result.filter(property => property.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice) {
      result = result.filter(property => property.price <= filters.maxPrice!);
    }
    
    // Filter by bedrooms
    if (filters.bedrooms) {
      result = result.filter(
        property => property.bedrooms && property.bedrooms >= filters.bedrooms!
      );
    }
    
    // Filter by purpose (rent/buy)
    if (filters.purpose) {
      result = result.filter(
        property => property.type === (filters.purpose === 'rent' ? 'rent' : 'sale')
      );
    }
    
    setFilteredProperties(result);
  }, [properties, searchTerm, filters]);
  
  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('q', searchTerm);
    if (filters.location) params.set('location', filters.location);
    if (filters.type) params.set('type', filters.type);
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms.toString());
    if (filters.purpose) params.set('purpose', filters.purpose);
    
    setSearchParams(params);
  }, [searchTerm, filters, setSearchParams]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already handled by the useEffect above
  };
  
  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };
  
  const applyFilters = () => {
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Search Header */}
      <div className="bg-primary-900 py-10">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-white mb-6">Find Your Perfect Property</h1>
          
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by location or property name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 h-12 w-full"
              />
            </div>
            
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="btn-outline flex items-center justify-center h-12 md:w-auto"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
            
            <button 
              type="submit"
              className="btn-primary h-12 md:w-auto"
            >
              Search Properties
            </button>
          </form>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container-custom py-8">
        {/* Search Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold">
              {filteredProperties.length} {filteredProperties.length === 1 ? 'Property' : 'Properties'} Found
            </h2>
            {(searchTerm || Object.values(filters).some(val => val !== undefined && val !== '')) && (
              <div className="flex flex-wrap gap-2 mt-2">
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200">
                    Search: {searchTerm}
                    <button onClick={() => setSearchTerm('')} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {filters.location && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200">
                    Location: {filters.location}
                    <button onClick={() => setFilters({...filters, location: ''})} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {filters.type && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200">
                    Type: {filters.type}
                    <button onClick={() => setFilters({...filters, type: ''})} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200">
                    Price: {filters.minPrice ? `UGX ${filters.minPrice.toLocaleString()}` : '0'} - {filters.maxPrice ? `UGX ${filters.maxPrice.toLocaleString()}` : 'Any'}
                    <button onClick={() => setFilters({...filters, minPrice: undefined, maxPrice: undefined})} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {filters.bedrooms && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200">
                    Bedrooms: {filters.bedrooms}+
                    <button onClick={() => setFilters({...filters, bedrooms: undefined})} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {filters.purpose && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200">
                    Purpose: {filters.purpose === 'rent' ? 'For Rent' : 'For Sale'}
                    <button onClick={() => setFilters({...filters, purpose: undefined})} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                <button 
                  onClick={clearFilters}
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <select className="select py-1 px-2 text-sm" defaultValue="relevance">
              <option value="relevance">Sort by: Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
            
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                className={cn(
                  "p-2",
                  viewMode === 'list' ? "bg-primary-100 text-primary-700" : "bg-white text-gray-500"
                )}
                onClick={() => setViewMode('list')}
              >
                <List className="h-5 w-5" />
              </button>
              <button
                className={cn(
                  "p-2",
                  viewMode === 'map' ? "bg-primary-100 text-primary-700" : "bg-white text-gray-500"
                )}
                onClick={() => setViewMode('map')}
              >
                <MapIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Main content with optional sidebar */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar (desktop) */}
          <div className="hidden md:block w-64 bg-white rounded-lg shadow-sm p-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="type-all"
                        name="type"
                        checked={!filters.type}
                        onChange={() => setFilters({...filters, type: ''})}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label htmlFor="type-all" className="ml-2 text-sm text-gray-700">All Types</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="type-apartment"
                        name="type"
                        checked={filters.type === 'apartment'}
                        onChange={() => setFilters({...filters, type: 'apartment'})}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label htmlFor="type-apartment" className="ml-2 text-sm text-gray-700 flex items-center">
                        <Building className="h-4 w-4 mr-1 text-gray-500" />
                        Apartment
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="type-house"
                        name="type"
                        checked={filters.type === 'house'}
                        onChange={() => setFilters({...filters, type: 'house'})}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label htmlFor="type-house" className="ml-2 text-sm text-gray-700 flex items-center">
                        <Home className="h-4 w-4 mr-1 text-gray-500" />
                        House
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="type-land"
                        name="type"
                        checked={filters.type === 'land'}
                        onChange={() => setFilters({...filters, type: 'land'})}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label htmlFor="type-land" className="ml-2 text-sm text-gray-700 flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                        Land
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="type-commercial"
                        name="type"
                        checked={filters.type === 'commercial'}
                        onChange={() => setFilters({...filters, type: 'commercial'})}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label htmlFor="type-commercial" className="ml-2 text-sm text-gray-700 flex items-center">
                        <Landmark className="h-4 w-4 mr-1 text-gray-500" />
                        Commercial
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (UGX)</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice || ''}
                      onChange={(e) => setFilters({...filters, minPrice: e.target.value ? Number(e.target.value) : undefined})}
                      className="input py-1 px-2 text-sm w-full"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice || ''}
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined})}
                      className="input py-1 px-2 text-sm w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilters({...filters, bedrooms: undefined})}
                      className={cn(
                        "px-3 py-1 rounded-md text-sm",
                        !filters.bedrooms ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-700"
                      )}
                    >
                      Any
                    </button>
                    {[1, 2, 3, 4, 5].map(num => (
                      <button
                        key={num}
                        onClick={() => setFilters({...filters, bedrooms: num})}
                        className={cn(
                          "px-3 py-1 rounded-md text-sm",
                          filters.bedrooms === num ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-700"
                        )}
                      >
                        {num}+
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Purpose</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="purpose-all"
                        name="purpose"
                        checked={!filters.purpose}
                        onChange={() => setFilters({...filters, purpose: undefined})}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label htmlFor="purpose-all" className="ml-2 text-sm text-gray-700">All</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="purpose-rent"
                        name="purpose"
                        checked={filters.purpose === 'rent'}
                        onChange={() => setFilters({...filters, purpose: 'rent'})}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label htmlFor="purpose-rent" className="ml-2 text-sm text-gray-700">For Rent</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="purpose-buy"
                        name="purpose"
                        checked={filters.purpose === 'buy'}
                        onChange={() => setFilters({...filters, purpose: 'buy'})}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label htmlFor="purpose-buy" className="ml-2 text-sm text-gray-700">For Sale</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="feature-verified"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="feature-verified" className="ml-2 text-sm text-gray-700">Verified Only</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="feature-new"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="feature-new" className="ml-2 text-sm text-gray-700">New Properties</label>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={clearFilters}
                  className="w-full btn-outline py-2"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-grow">
            {viewMode === 'list' ? (
              <>
                {filteredProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map(property => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <Search className="h-12 w-12 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                    <p className="text-gray-600 mb-4">
                      We couldn't find any properties matching your search criteria.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="btn-primary"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg p-4 h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Map View Coming Soon</h3>
                  <p className="text-gray-600">
                    We're working on an interactive map feature to help you explore properties by location.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Filter Sheet */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex md:hidden">
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <SlidersHorizontal className="h-5 w-5 mr-2" />
                    Filters
                  </h2>
                  <button
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 mb-2">Property Type</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setFilters({...filters, type: ''})}
                        className={cn(
                          "flex items-center justify-center px-3 py-2 border rounded-md text-sm",
                          !filters.type ? "bg-primary-50 border-primary-300 text-primary-700" : "border-gray-300"
                        )}
                      >
                        All Types
                      </button>
                      <button
                        onClick={() => setFilters({...filters, type: 'apartment'})}
                        className={cn(
                          "flex items-center justify-center px-3 py-2 border rounded-md text-sm",
                          filters.type === 'apartment' ? "bg-primary-50 border-primary-300 text-primary-700" : "border-gray-300"
                        )}
                      >
                        <Building className="h-4 w-4 mr-1" />
                        Apartment
                      </button>
                      <button
                        onClick={() => setFilters({...filters, type: 'house'})}
                        className={cn(
                          "flex items-center justify-center px-3 py-2 border rounded-md text-sm",
                          filters.type === 'house' ? "bg-primary-50 border-primary-300 text-primary-700" : "border-gray-300"
                        )}
                      >
                        <Home className="h-4 w-4 mr-1" />
                        House
                      </button>
                      <button
                        onClick={() => setFilters({...filters, type: 'land'})}
                        className={cn(
                          "flex items-center justify-center px-3 py-2 border rounded-md text-sm",
                          filters.type === 'land' ? "bg-primary-50 border-primary-300 text-primary-700" : "border-gray-300"
                        )}
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        Land
                      </button>
                      <button
                        onClick={() => setFilters({...filters, type: 'commercial'})}
                        className={cn(
                          "flex items-center justify-center px-3 py-2 border rounded-md text-sm",
                          filters.type === 'commercial' ? "bg-primary-50 border-primary-300 text-primary-700" : "border-gray-300"
                        )}
                      >
                        <Landmark className="h-4 w-4 mr-1" />
                        Commercial
                      </button>
                      <button
                        onClick={() => setFilters({...filters, type: 'office'})}
                        className={cn(
                          "flex items-center justify-center px-3 py-2 border rounded-md text-sm",
                          filters.type === 'office' ? "bg-primary-50 border-primary-300 text-primary-700" : "border-gray-300"
                        )}
                      >
                        <Building className="h-4 w-4 mr-1" />
                        Office
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium text-gray-900 mb-2">Price Range (UGX)</h3>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.minPrice || ''}
                          onChange={(e) => setFilters({...filters, minPrice: e.target.value ? Number(e.target.value) : undefined})}
                          className="input pl-9 py-2"
                        />
                      </div>
                      <span>to</span>
                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.maxPrice || ''}
                          onChange={(e) => setFilters({...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined})}
                          className="input pl-9 py-2"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium text-gray-900 mb-2">Bedrooms</h3>
                    <div className="flex justify-between">
                      <button
                        onClick={() => setFilters({...filters, bedrooms: undefined})}
                        className={cn(
                          "inline-flex items-center justify-center h-10 w-12 border rounded-md",
                          !filters.bedrooms ? "bg-primary-50 border-primary-300 text-primary-700" : "border-gray-300"
                        )}
                      >
                        Any
                      </button>
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          onClick={() => setFilters({...filters, bedrooms: num})}
                          className={cn(
                            "inline-flex items-center justify-center h-10 w-12 border rounded-md",
                            filters.bedrooms === num ? "bg-primary-50 border-primary-300 text-primary-700" : "border-gray-300"
                          )}
                        >
                          {num}+
                          <Bed className="h-3 w-3 ml-1" />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium text-gray-900 mb-2">Bathrooms</h3>
                    <div className="flex justify-between">
                      <button
                        className="inline-flex items-center justify-center h-10 w-12 border rounded-md border-gray-300"
                      >
                        Any
                      </button>
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          className="inline-flex items-center justify-center h-10 w-12 border rounded-md border-gray-300"
                        >
                          {num}+
                          <Bath className="h-3 w-3 ml-1" />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium text-gray-900 mb-2">Property Purpose</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setFilters({...filters, purpose: undefined})}
                        className={cn(
                          "px-3 py-2 border rounded-md text-sm",
                          !filters.purpose ? "bg-primary-50 border-primary-300 text-primary-700" : "border-gray-300"
                        )}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setFilters({...filters, purpose: 'rent'})}
                        className={cn(
                          "px-3 py-2 border rounded-md text-sm",
                          filters.purpose === 'rent' ? "bg-primary-50 border-primary-300 text-primary-700" : "border-gray-300"
                        )}
                      >
                        For Rent
                      </button>
                      <button
                        onClick={() => setFilters({...filters, purpose: 'buy'})}
                        className={cn(
                          "px-3 py-2 border rounded-md text-sm",
                          filters.purpose === 'buy' ? "bg-primary-50 border-primary-300 text-primary-700" : "border-gray-300"
                        )}
                      >
                        For Sale
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium text-gray-900 mb-2">More Filters</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Verified Properties Only</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">New Listings Only</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Properties with Photos</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0 px-4 py-3 flex justify-between border-t border-gray-200">
                  <button
                    type="button"
                    className="btn-outline py-2"
                    onClick={clearFilters}
                  >
                    Clear All
                  </button>
                  <button
                    type="button"
                    className="btn-primary py-2"
                    onClick={applyFilters}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;