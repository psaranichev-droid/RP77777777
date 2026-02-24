import { Star, ShoppingCart, Heart, Loader2, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart, useFavorites } from '../store/useStore';
import { cn } from '../utils/cn';
import { staggerChild } from '../utils/animations';
import { fetchProductsFromYML, Product } from '../services/productService';
import { TEXTURE_PATTERNS } from '../utils/textures';

const YML_URL = "https://yastore-prod-persist.s3.yandex.net/feeds/yml/019a4608-b88b-7916-8afb-3558dd6d2eda.xml";

export const ProductGrid: React.FC = () => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductsFromYML(YML_URL);
        if (!data || data.length === 0) {
          setError('Товары не загружены. Пожалуйста, проверьте соединение.');
        } else {
          setProducts(data.slice(0, 12));
          setError(null);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Ошибка при загрузке товаров. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-14 h-14 text-[#005bff] animate-spin" />
          <p className="text-[#808080] font-medium text-[16px]">Загрузка товаров из каталога...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Info className="w-14 h-14 text-[#808080]" />
          <p className="text-[#808080] font-medium text-[16px]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 max-w-[1440px] mx-auto relative">
      {/* Subtle background texture - встроенная SVG */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0"
        style={{
          backgroundImage: `url('${TEXTURE_PATTERNS.crumpledPaper}')`,
        }}
      />
      
      <div className="relative z-10 flex items-end justify-between mb-10">
        <div>
          <h2 className="text-[28px] font-bold text-[#212121] mb-2 font-rubik">Наши товары</h2>
          <p className="text-[#808080] font-inter">Актуальный ассортимент из нашего каталога.</p>
        </div>
        <Link to="/catalog" className="hidden sm:block text-[#005bff] font-bold hover:underline font-inter">
          Все товары
        </Link>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product, index) => {
          const numericId = parseInt(product.id.slice(0, 8), 16) || index;
          const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

          return (
            <motion.div
              key={product.id}
              {...staggerChild(index)}
              className="group relative flex flex-col bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 border border-[#f0f0f0]"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-white">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
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

              {/* Product Info */}
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
                  <h3 className="text-[14px] text-[#212121] leading-[18px] mb-2 line-clamp-3 hover:text-[#005bff] transition-colors h-[54px]">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-3.5 h-3.5 fill-[#ffa800] text-[#ffa800]" />
                  <span className="text-[12px] font-bold text-[#212121]">4.8</span>
                  <span className="text-[12px] text-[#808080] ml-1">90 731 отзыв</span>
                </div>

                {/* Add to Cart Button */}
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
      </div>
      
      <div className="mt-12 text-center">
        <Link to="/catalog" className="inline-block px-8 py-3 bg-white text-[#212121] font-bold rounded-lg hover:border-[#b0b0b0] transition-colors duration-200 border border-[#e0e0e0] text-[14px]">
          Перейти в каталог
        </Link>
      </div>
    </section>
  );
};
