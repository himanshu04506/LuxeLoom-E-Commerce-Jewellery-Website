import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../../services/productService';
import ProductCard from '../../components/product/ProductCard';
import ProductFilter from '../../components/product/ProductFilter';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';
import { Sparkles, SlidersHorizontal, PackageX } from 'lucide-react';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Read query params from URL
  const filters = {
    category: searchParams.get('category') || '',
    metalType: searchParams.get('metalType') || '',
    purity: searchParams.get('purity') || '',
    search: searchParams.get('search') || '',
    isFeatured: searchParams.get('isFeatured') || '',
    isBestSeller: searchParams.get('isBestSeller') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '',
  };

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const query = {
        ...filters,
        page: currentPage,
        limit: 12,
      };
      const data = await getProducts(query);
      if (data.success) {
        setProducts(data.products);
        setTotalCount(data.count);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching catalog', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [searchParams, currentPage]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setCurrentPage(1);
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Toast Alert */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Header Banner */}
      <div className="bg-ivory border border-gold-300 p-8 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-600">
            <Sparkles className="w-4 h-4" /> Live Pricing Catalogue
          </div>
          <h1 className="font-serif text-3xl font-bold text-obsidian mt-1">
            {filters.search && filters.category
              ? `${filters.category} matching "${filters.search}"`
              : filters.search
              ? `Search Results for "${filters.search}"`
              : filters.category
              ? `${filters.category} Collection`
              : 'All Fine Jewellery'}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Showing {products.length} of {totalCount} certified products priced with live bullion rates.
          </p>
        </div>

        <button
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="md:hidden w-full bg-obsidian text-gold-400 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" /> Toggle Filters
        </button>
      </div>

      {/* Active Filter Badges Bar */}
      {(filters.search || filters.category || filters.metalType || filters.purity || filters.minPrice || filters.maxPrice || filters.sort) && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-white border border-gold-200 rounded-xl text-xs">
          <span className="text-zinc-400 font-medium mr-1">Active filters:</span>

          {filters.search && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-50 text-gold-900 border border-gold-300 rounded-full font-medium">
              Search: "{filters.search}"
              <button
                onClick={() => handleFilterChange('search', '')}
                className="text-gold-600 hover:text-gold-950 ml-0.5"
                title="Remove search filter"
              >
                ✕
              </button>
            </span>
          )}

          {filters.category && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-50 text-gold-900 border border-gold-300 rounded-full font-medium">
              Category: {filters.category}
              <button
                onClick={() => handleFilterChange('category', '')}
                className="text-gold-600 hover:text-gold-950 ml-0.5"
              >
                ✕
              </button>
            </span>
          )}

          {filters.metalType && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-50 text-gold-900 border border-gold-300 rounded-full font-medium">
              Metal: {filters.metalType}
              <button
                onClick={() => handleFilterChange('metalType', '')}
                className="text-gold-600 hover:text-gold-950 ml-0.5"
              >
                ✕
              </button>
            </span>
          )}

          {filters.purity && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-50 text-gold-900 border border-gold-300 rounded-full font-medium">
              Purity: {filters.purity}
              <button
                onClick={() => handleFilterChange('purity', '')}
                className="text-gold-600 hover:text-gold-950 ml-0.5"
              >
                ✕
              </button>
            </span>
          )}

          {filters.minPrice && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-50 text-gold-900 border border-gold-300 rounded-full font-medium">
              Min: ₹{Number(filters.minPrice).toLocaleString('en-IN')}
              <button
                onClick={() => handleFilterChange('minPrice', '')}
                className="text-gold-600 hover:text-gold-950 ml-0.5"
              >
                ✕
              </button>
            </span>
          )}

          {filters.maxPrice && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-50 text-gold-900 border border-gold-300 rounded-full font-medium">
              Max: ₹{Number(filters.maxPrice).toLocaleString('en-IN')}
              <button
                onClick={() => handleFilterChange('maxPrice', '')}
                className="text-gold-600 hover:text-gold-950 ml-0.5"
              >
                ✕
              </button>
            </span>
          )}

          {filters.sort && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-50 text-gold-900 border border-gold-300 rounded-full font-medium">
              Sort: {filters.sort === 'price_asc' ? 'Price Low-High' : filters.sort === 'price_desc' ? 'Price High-Low' : 'Weight'}
              <button
                onClick={() => handleFilterChange('sort', '')}
                className="text-gold-600 hover:text-gold-950 ml-0.5"
              >
                ✕
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="ml-auto text-gold-700 hover:text-gold-900 font-semibold underline text-xs"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid & Filters Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <div className={`md:block ${isMobileFilterOpen ? 'block' : 'hidden'}`}>
          <ProductFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Product Grid Area */}
        <div className="md:col-span-3 space-y-8">
          
          {loading ? (
            <LoadingSpinner text="Recalculating live product catalogue prices..." />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onShowToast={(msg, type) => setToast({ message: msg, type })}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gold-200 p-12 rounded-2xl text-center space-y-4 shadow-sm">
              <PackageX className="w-12 h-12 text-gold-400 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-obsidian">
                {filters.search
                  ? `No jewellery matches "${filters.search}"`
                  : 'No Jewellery Matches Your Filters'}
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Try loosening your search terms, price range, or category filter to discover more products.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                {filters.search && (
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="px-5 py-2.5 bg-gold-500 text-white text-xs font-bold rounded-xl hover:bg-gold-600 transition-colors shadow-sm"
                  >
                    Clear Search Query
                  </button>
                )}
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-obsidian text-gold-400 text-xs font-bold rounded-xl hover:bg-zinc-800 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gold-300 rounded-lg text-xs font-semibold bg-white text-obsidian disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-colors ${
                    currentPage === page
                      ? 'bg-gold-500 text-white shadow-sm'
                      : 'bg-white text-obsidian border border-gold-200 hover:bg-gold-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gold-300 rounded-lg text-xs font-semibold bg-white text-obsidian disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Catalog;
