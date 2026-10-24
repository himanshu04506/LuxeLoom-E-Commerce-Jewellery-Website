import React from 'react';
import { Filter, RotateCcw, Search, X } from 'lucide-react';

const ProductFilter = ({ filters, onFilterChange, onReset }) => {
  const categories = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bangles', 'Chains', 'Pendants'];

  // Count how many filters are active
  const activeFilterCount = [
    filters.search,
    filters.category,
    filters.metalType,
    filters.purity,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
  ].filter(Boolean).length;

  return (
    <div className="bg-white border border-gold-200 p-5 rounded-xl space-y-6 shadow-sm">
      
      <div className="flex items-center justify-between border-b border-gold-100 pb-3">
        <h3 className="font-serif font-bold text-base text-obsidian flex items-center gap-2">
          <Filter className="w-4 h-4 text-gold-500" />
          <span>Filter Jewellery</span>
          {activeFilterCount > 0 && (
            <span className="bg-gold-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              {activeFilterCount}
            </span>
          )}
        </h3>
        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-zinc-500 hover:text-gold-600 flex items-center gap-1 transition-colors font-medium"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Keyword Search Input */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gold-800 block">
          Keyword Search
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="e.g. Solitaire, 22K, Choker..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full text-xs pl-8 pr-7 py-2 bg-ivory border border-gold-200 rounded-lg focus:outline-none focus:border-gold-500 transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          {filters.search && (
            <button
              onClick={() => onFilterChange('search', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gold-800 block">Category</label>
        <select
          value={filters.category || ''}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="w-full text-xs p-2.5 bg-ivory border border-gold-200 rounded-lg focus:outline-none focus:border-gold-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Metal Type Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gold-800 block">Metal Type</label>
        <div className="grid grid-cols-3 gap-2">
          {['', 'GOLD', 'SILVER'].map((metal) => (
            <button
              key={metal || 'all'}
              onClick={() => onFilterChange('metalType', metal)}
              className={`py-1.5 px-2 text-xs font-medium rounded-lg border text-center transition-all ${
                (filters.metalType || '') === metal
                  ? 'bg-obsidian text-gold-400 border-obsidian'
                  : 'bg-ivory text-zinc-600 border-gold-200 hover:border-gold-400'
              }`}
            >
              {metal || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Purity Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gold-800 block">Gold / Silver Purity</label>
        <select
          value={filters.purity || ''}
          onChange={(e) => onFilterChange('purity', e.target.value)}
          className="w-full text-xs p-2.5 bg-ivory border border-gold-200 rounded-lg focus:outline-none focus:border-gold-500"
        >
          <option value="">All Purities</option>
          <option value="24K">24K Pure Gold (99.9%)</option>
          <option value="22K">22K Standard Gold (91.6%)</option>
          <option value="18K">18K Modern Gold (75.0%)</option>
          <option value="925">925 Sterling Silver</option>
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gold-800 block">Price Range (₹)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            className="w-full text-xs p-2 bg-ivory border border-gold-200 rounded-lg"
          />
          <span className="text-zinc-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="w-full text-xs p-2 bg-ivory border border-gold-200 rounded-lg"
          />
        </div>
      </div>

      {/* Sort Option */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gold-800 block">Sort By</label>
        <select
          value={filters.sort || ''}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="w-full text-xs p-2.5 bg-ivory border border-gold-200 rounded-lg focus:outline-none focus:border-gold-500"
        >
          <option value="">Newest Arrival</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="weight_desc">Metal Weight: High to Low</option>
        </select>
      </div>

    </div>
  );
};

export default ProductFilter;
