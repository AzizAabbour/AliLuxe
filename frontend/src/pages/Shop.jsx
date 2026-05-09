import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiSearch, FiChevronDown, FiX } from 'react-icons/fi';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/shop/ProductCard';
import api from '../api/axios';

export default function Shop() {
  const { category: categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  
  const { items, pagination, loading } = useSelector((state) => state.products);
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category_slug: categorySlug || searchParams.get('category') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    sort_by: searchParams.get('sort_by') || 'newest',
  });

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    const params = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] !== '') params[key] = filters[key];
    });
    params.category_slug = categorySlug || filters.category_slug;
    params.page = searchParams.get('page') || 1;
    dispatch(fetchProducts(params));
  }, [dispatch, filters, categorySlug, searchParams]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    if (name === 'category_slug' && value) {
      setSearchParams({ category: value });
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category_slug: '',
      min_price: '',
      max_price: '',
      sort_by: 'newest',
    });
    setSearchParams({});
  };

  return (
    <div className="page pt-32" style={{ paddingTop: '8rem' }}>
      <div className="container">
        <header className="page-header text-center mb-16" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
            {categorySlug ? categories.find(c => c.slug === categorySlug)?.name : 'Our Collection'}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>
            Curated excellence for your refined lifestyle.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-10" style={{ display: 'flex', gap: '2.5rem' }}>
          {/* Filters Sidebar (Desktop) / Toggle (Mobile) */}
          <aside className="lg:w-64 flex-shrink-0" style={{ width: '16rem', flexShrink: 0 }}>
            <div className="sticky top-32" style={{ position: 'sticky', top: '8rem' }}>
              <div className="flex items-center justify-between mb-8" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h3 className="text-xl font-bold flex items-center gap-2" style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiFilter className="text-primary" /> Filters
                </h3>
                <button onClick={clearFilters} className="text-xs text-primary font-bold hover:underline" style={{ fontSize: '0.75rem', color: 'var(--color-primary)', background: 'none' }}>
                  RESET
                </button>
              </div>

              {/* Search */}
              <div className="mb-8" style={{ marginBottom: '2rem' }}>
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    placeholder="Search..."
                    className="input-field w-full pl-12"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    style={{ width: '100%', paddingLeft: '3rem' }}
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-8" style={{ marginBottom: '2rem' }}>
                <h4 className="text-sm font-bold uppercase tracking-widest mb-4 text-text-secondary" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>Categories</h4>
                <div className="flex flex-col gap-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button 
                    onClick={() => handleFilterChange('category_slug', '')}
                    className={`text-left py-1 hover:text-primary transition-colors ${!filters.category_slug && !categorySlug ? 'text-primary font-bold' : 'text-text-secondary'}`}
                    style={{ textAlign: 'left', background: 'none' }}
                  >
                    All Products
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => handleFilterChange('category_slug', cat.slug)}
                      className={`text-left py-1 hover:text-primary transition-colors ${(filters.category_slug === cat.slug || categorySlug === cat.slug) ? 'text-primary font-bold' : 'text-text-secondary'}`}
                      style={{ textAlign: 'left', background: 'none' }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8" style={{ marginBottom: '2rem' }}>
                <h4 className="text-sm font-bold uppercase tracking-widest mb-4 text-text-secondary" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>Price Range</h4>
                <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input 
                    type="number" 
                    placeholder="Min" 
                    className="input-field w-full p-2 text-sm"
                    value={filters.min_price}
                    onChange={(e) => handleFilterChange('min_price', e.target.value)}
                    style={{ width: '100%', padding: '0.5rem' }}
                  />
                  <span className="text-text-muted">-</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    className="input-field w-full p-2 text-sm"
                    value={filters.max_price}
                    onChange={(e) => handleFilterChange('max_price', e.target.value)}
                    style={{ width: '100%', padding: '0.5rem' }}
                  />
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest mb-4 text-text-secondary" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>Sort By</h4>
                <select 
                  className="input-field w-full"
                  value={filters.sort_by}
                  onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                  style={{ width: '100%', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,...")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
                >
                  <option value="newest">Newest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products List */}
          <div className="flex-grow" style={{ flexGrow: 1 }}>
            {loading ? (
              <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-[400px] skeleton" style={{ height: '400px', borderRadius: '1rem' }} />)}
              </div>
            ) : items.length > 0 ? (
              <>
                <motion.div 
                  layout
                  className="products-grid"
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}
                >
                  {items.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
                
                {/* Pagination */}
                {pagination?.lastPage > 1 && (
                  <div className="mt-16 flex justify-center gap-2" style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    {Array.from({ length: pagination.lastPage }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page })}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all ${pagination.currentPage === page ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white/5 text-text-secondary hover:bg-white/10'}`}
                        style={{ width: '40px', height: '40px', borderRadius: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state" style={{ padding: '5rem 0', textAlign: 'center' }}>
                <FiSearch size={48} className="mx-auto mb-4 opacity-20" style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                <h3 className="text-2xl font-bold mb-2">No products found</h3>
                <p className="text-text-secondary mb-8">Try adjusting your filters or search query.</p>
                <button onClick={clearFilters} className="btn btn-primary">Clear All Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
