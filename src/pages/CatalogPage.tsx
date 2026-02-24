import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Heart, ShoppingCart, Filter, X, ChevronRight, Star, Info } from 'lucide-react';
import { fetchProductsFromYML, Product } from '../services/productService';
import { useCart, useFavorites } from '../store/useStore';
import { cn } from '../utils/cn';

const YML_URL = "https://yastore-prod-persist.s3.yandex.net/feeds/yml/019a4608-b88b-7916-8afb-3558dd6d2eda.xml";

const categories = [
  {
    id: 'all',
    title: 'Все категории',
    xmlName: undefined,
    subcategories: []
  },
  {
    id: 'offset',
    title: 'Офсетная бумага',
    xmlName: 'Офсетная бумага',
    subcategories: [
      { id: 'offset-high', name: 'Высокой плотности' },
      { id: 'offset-increased', name: 'Повышенный плотности' },
      { id: 'offset-standard', name: 'Стандартный плотности' }
    ]
  },
  {
    id: 'coated',
    title: 'Мелованная бумага',
    xmlName: 'Мелованная бумага',
    subcategories: [
      { id: 'coated-glossy', name: 'Глянцевая' },
      { id: 'coated-matte', name: 'Матовая' }
    ]
  },
  {
    id: 'designer',
    title: 'Дизайнерская бумага',
    xmlName: 'Дизайнерская бумага',
    subcategories: [
      { id: 'designer-knight-color', name: 'Knight Color' },
      { id: 'designer-rubber-like', name: 'Rubber Like' },
      { id: 'designer-galaxy', name: 'Galaxy Metallic' },
      { id: 'designer-fiber', name: 'Fiber Art' },
      { id: 'designer-smooth', name: 'Color Style Smooth' },
      { id: 'designer-knight-black', name: 'Knight Black' }
    ]
  },
  {
    id: 'cardboard',
    title: 'Картон',
    xmlName: 'Картон',
    subcategories: [
      { id: 'cardboard-coated', name: 'Мелованый' }
    ]
  },
  {
    id: 'blanks',
    title: 'Заготовки',
    xmlName: 'Заготовки',
    subcategories: [
      { id: 'blanks-cards', name: 'Карточки' }
    ]
  }
];

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCatId = searchParams.get('cat') || 'all';
  const currentSubcatId = searchParams.get('subcat');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const selectedCat = categories.find(c => c.id === currentCatId);
        const selectedSubcat = selectedCat?.subcategories.find(s => s.id === currentSubcatId);

        const data = await fetchProductsFromYML(
          YML_URL,
          selectedCat?.xmlName,
          selectedSubcat?.name
        );

        if (!data || data.length === 0) {
          setError('Товары не загружены. Пожалуйста, проверьте соединение.');
        }
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Ошибка при загрузке товаров. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [currentCatId, currentSubcatId]);

  const handleCategoryChange = (id: string) => {
    if (id === 'all') {
      searchParams.delete('cat');
      searchParams.delete('subcat');
    } else {
      searchParams.set('cat', id);
      searchParams.delete('subcat');
    }
    setSearchParams(searchParams);
    setShowFilters(false);
  };

  const handleSubcategoryChange = (subcatId: string) => {
    searchParams.set('subcat', subcatId);
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-[#f2f3f5] min-h-screen pt-8 pb-16 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[13px] text-[#808080] mb-4">
          <Link to="/" className="hover:text-[#005bff]">Канцелярские товары</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#212121]">Бумага</span>
        </nav>

        {/* Title */}
        <h1 className="text-[28px] md:text-[32px] font-bold text-[#212121] mb-3">
          {categories.find(c => c.id === currentCatId)?.title || 'Все товары'}
        </h1>

        {/* Horizontal Chips */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-lg text-[14px] font-medium transition-all border",
                currentCatId === cat.id 
                  ? "bg-[#212121] text-white border-[#212121]" 
                  : "bg-white text-[#212121] border-[#e0e0e0] hover:border-[#b0b0b0]"
              )}
            >
              {cat.title}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Sidebar (Ozon Style) */}
          <aside className="hidden lg:block w-[320px] shrink-0">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-[#e0e0e0]">
              <div className="space-y-2">
                {categories.filter(c => c.id !== 'all').map(cat => (
                  <div key={cat.id}>
                    <div
                      onClick={() => handleCategoryChange(cat.id)}
                      className={cn(
                        "text-[14px] cursor-pointer hover:text-[#005bff] px-3 py-2 rounded-lg",
                        currentCatId === cat.id ? "bg-[#f2f3f5] text-[#005bff] font-bold" : "text-[#212121]"
                      )}
                    >
                      {cat.title}
                    </div>
                    {currentCatId === cat.id && cat.subcategories.length > 0 && (
                      <div className="mt-2 ml-4 space-y-1.5">
                        {cat.subcategories.map(subcat => (
                          <div
                            key={subcat.id}
                            onClick={() => handleSubcategoryChange(subcat.id)}
                            className={cn(
                              "text-[13px] cursor-pointer hover:text-[#005bff]",
                              currentSubcatId === subcat.id ? "text-[#005bff] font-bold" : "text-[#808080]"
                            )}
                          >
                            {subcat.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[#f2f3f5]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[14px] text-[#212121]">Распродажа</span>
                  <div className="w-10 h-5 bg-[#e0e0e0] rounded-full relative cursor-pointer">
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sorting */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 pr-10 text-[14px] font-medium text-[#212121] cursor-pointer hover:border-[#b0b0b0] outline-none"
                >
                  <option value="popular">Популярные</option>
                  <option value="cheap">Сначала дешевые</option>
                  <option value="expensive">Сначала дорогие</option>
                  <option value="new">Новинки</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronRight className="w-4 h-4 rotate-90 text-[#808080]" />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-14 h-14 text-[#005bff] animate-spin" />
                  <p className="text-[#808080] font-medium text-[16px]">Загружаем товары...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-32 bg-white rounded-xl border border-[#e0e0e0]">
                <Info className="w-14 h-14 text-[#808080] mx-auto mb-4" />
                <p className="text-[#808080] font-medium mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-[#005bff] font-bold hover:underline"
                >
                  Попробовать снова
                </button>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {products.map((product, idx) => {
                    const numericId = parseInt(product.id.slice(0, 8), 16) || idx;
                    const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
                    
                    return (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-[#f0f0f0]"
                      >
                        {/* Image Section */}
                        <div className="relative aspect-[3/4] bg-white overflow-hidden">
                          <Link to={`/product/${product.id}`}>
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                            />
                          </Link>
                          
                          {/* Favorite Button */}
                          <button 
                            onClick={() => toggleFavorite({
                              id: numericId,
                              name: product.name,
                              category: product.category,
                              price: product.price,
                              image: product.image
                            })}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white shadow-sm z-10"
                          >
                            <Heart className={cn("w-5 h-5 transition-colors", isFavorite(numericId) ? "text-[#f91155] fill-[#f91155]" : "text-[#212121] hover:text-[#f91155]")} />
                          </button>

                          {/* Sale Badge */}
                          {product.oldPrice && (
                            <div className="absolute bottom-2 left-2 bg-[#f91155] text-white text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                              <Info className="w-3 h-3" />
                              Распродажа
                            </div>
                          )}
                        </div>

                        {/* Info Section */}
                        <div className="p-3 flex-1 flex flex-col">
                          {/* Price */}
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className={cn("text-[17px] font-bold", product.oldPrice ? "text-[#f91155]" : "text-[#212121]")}>
                              {product.price.toFixed(0)} ₽
                            </span>
                            {product.oldPrice && (
                              <>
                                <span className="text-[13px] text-[#808080] line-through">
                                  {product.oldPrice.toFixed(0)} ₽
                                </span>
                                <span className="text-[13px] text-[#f91155] font-bold">
                                  -{discount}%
                                </span>
                              </>
                            )}
                          </div>

                          {/* Name */}
                          <Link to={`/product/${product.id}`}>
                            <h4 className="text-[14px] text-[#212121] leading-[18px] mb-2 line-clamp-3 hover:text-[#005bff] transition-colors h-[54px]">
                              {product.name}
                            </h4>
                          </Link>

                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-3">
                            <Star className="w-3.5 h-3.5 fill-[#ffa800] text-[#ffa800]" />
                            <span className="text-[12px] font-bold text-[#212121]">4.8</span>
                            <span className="text-[12px] text-[#808080] ml-1">90 731 отзыв</span>
                          </div>

                          {/* Add to Cart Button (Ozon Style) */}
                          <button 
                            onClick={() => addToCart({
                              id: numericId,
                              name: product.name,
                              category: product.category,
                              price: product.price,
                              image: product.image
                            })}
                            className="mt-auto w-full bg-[#005bff] hover:bg-[#004ed6] text-white rounded-lg py-2.5 px-4 text-[14px] font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Завтра</span>
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-xl border border-[#e0e0e0]">
                <p className="text-[#808080] font-medium">В данной категории пока нет товаров.</p>
                <button 
                  onClick={() => handleCategoryChange('all')}
                  className="mt-4 text-[#005bff] font-bold hover:underline"
                >
                  Вернуться ко всем товарам
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay (Ozon Style) */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-[400px] bg-white p-6 z-50 lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[20px] font-bold text-[#212121]">Фильтры</h3>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-[#f2f3f5] rounded-full transition-colors">
                  <X className="w-6 h-6 text-[#212121]" />
                </button>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-[16px] font-bold text-[#212121] mb-4">Категории</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-lg transition-all font-medium text-[14px]",
                          currentCatId === cat.id 
                            ? "bg-[#005bff] text-white" 
                            : "bg-[#f2f3f5] text-[#212121]"
                        )}
                      >
                        {cat.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#f2f3f5]">
                  <h4 className="text-[16px] font-bold text-[#212121] mb-4">Сроки доставки</h4>
                  <div className="space-y-4">
                    {['Неважно', 'От 1 часа', 'Сегодня', 'Завтра'].map((label, i) => (
                      <label key={label} className="flex items-center gap-3 cursor-pointer">
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                          i === 0 ? "border-[#005bff]" : "border-[#e0e0e0]"
                        )}>
                          {i === 0 && <div className="w-3 h-3 bg-[#005bff] rounded-full"></div>}
                        </div>
                        <span className="text-[15px] text-[#212121]">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 left-0 right-0 pt-6 mt-8 bg-white border-t border-[#f2f3f5]">
                <button 
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-[#005bff] text-white py-4 rounded-xl font-bold text-[16px]"
                >
                  Показать товары
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CatalogPage;
