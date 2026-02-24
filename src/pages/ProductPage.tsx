import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Heart, ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, RotateCcw, ChevronRight, ChevronLeft, Info, X } from 'lucide-react';
import { fetchProductsFromYML, Product } from '../services/productService';
import { useCart, useFavorites } from '../store/useStore';
import { cn } from '../utils/cn';

const YML_URL = "https://yastore-prod-persist.s3.yandex.net/feeds/yml/019a4608-b88b-7916-8afb-3558dd6d2eda.xml";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProductsFromYML(YML_URL);

        if (!data || data.length === 0) {
          setError('Не удалось загрузить товары. Пожалуйста, проверьте соединение.');
          setProduct(null);
          return;
        }

        const found = data.find(p => p.id === id);

        if (found) {
          setProduct(found);
          // Related products from same category
          const related = data
            .filter(p => p.category === found.category && p.id !== found.id)
            .slice(0, 4);
          setRelatedProducts(related);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
        setError('Ошибка при загрузке товара. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2f3f5]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-14 h-14 text-[#005bff] animate-spin" />
          <p className="text-[#808080] font-medium text-[16px]">Загружаем информацию о товаре...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f2f3f5] px-4">
        <Info className="w-14 h-14 text-[#808080] mb-4" />
        <h2 className="text-2xl font-bold text-[#212121] mb-4">Ошибка загрузки</h2>
        <p className="text-[#808080] mb-8 text-center">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-[#005bff] text-white font-bold rounded-xl hover:bg-[#004ed6] transition-colors mr-4"
        >
          Попробовать снова
        </button>
        <Link to="/catalog" className="px-8 py-4 bg-white text-[#212121] font-bold rounded-xl hover:bg-[#f2f3f5] transition-colors border border-[#e0e0e0]">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f2f3f5] px-4">
        <h2 className="text-2xl font-bold text-[#212121] mb-4">Товар не найден</h2>
        <p className="text-[#808080] mb-8 text-center">К сожалению, запрашиваемый товар не найден в нашем каталоге.</p>
        <Link to="/catalog" className="px-8 py-4 bg-[#005bff] text-white font-bold rounded-xl hover:bg-[#004ed6] transition-colors">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  const numericId = parseInt(product.id.slice(0, 8), 16) || 0;
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <div className="bg-[#f2f3f5] min-h-screen pt-8 pb-24 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        {/* Breadcrumbs with Product Name */}
        <nav className="flex items-center gap-2 text-[13px] text-[#808080] mb-4">
          <Link to="/" className="hover:text-[#005bff]">Главная</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/catalog" className="hover:text-[#005bff]">Каталог</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#808080]">{product.category}</span>
        </nav>
        <h1 className="text-[28px] md:text-[32px] font-bold text-[#212121] leading-tight mb-3">
          {product.name}
        </h1>
        <div className="flex items-center gap-4 flex-wrap mb-6">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#ffa800] text-[#ffa800]" />
            <span className="text-[14px] font-bold text-[#212121]">4.9</span>
          </div>
          <span className="text-[14px] text-[#005bff] font-medium cursor-pointer hover:underline">12 отзывов</span>
          <span className="text-[14px] text-[#808080]">Артикул: {product.id.slice(0, 8)}</span>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0e0e0]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Product Image */}
            <div className="lg:col-span-5">
              <div className="flex flex-col gap-4">
                {/* Main Image Container */}
                <div
                  className="relative aspect-[3/4] rounded-xl overflow-hidden flex items-center justify-center group cursor-pointer"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <img
                    src={product.images?.[selectedImageIndex] || product.image}
                    alt={product.name}
                    className="w-full h-full object-contain relative z-10 group-hover:opacity-90 transition-opacity"
                  />

                  {product.oldPrice && (
                    <div className="absolute top-4 left-4 bg-[#f91155] text-white text-[12px] font-bold px-3 py-1 rounded flex items-center gap-1 z-20">
                      <Info className="w-3.5 h-3.5" />
                      Распродажа
                    </div>
                  )}

                  <button
                    onClick={() => toggleFavorite({
                      id: numericId,
                      name: product.name,
                      category: product.category,
                      price: product.price,
                      image: product.image
                    })}
                    className={cn(
                      "absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center transition-all hover:scale-110 z-20",
                      isFavorite(numericId) ? "text-[#f91155]" : "text-[#212121] hover:text-[#f91155]"
                    )}
                  >
                    <Heart className={cn("w-6 h-6", isFavorite(numericId) && "fill-[#f91155]")} />
                  </button>
                </div>

                {/* Галерея миниатюр */}
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={cn(
                          "flex-shrink-0 aspect-[3/4] w-20 rounded-lg overflow-hidden border-2 transition-all",
                          selectedImageIndex === idx
                            ? "border-[#005bff] shadow-sm"
                            : "border-[#e0e0e0] hover:border-[#b0b0b0]"
                        )}
                      >
                        <img
                          src={img}
                          alt={`View ${idx + 1}`}
                          className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Brief Description */}
                  <div>
                    <h3 className="text-[18px] font-bold text-[#212121] mb-4">Краткое описание</h3>
                    <p className="text-[13px] text-[#808080] leading-relaxed mb-4">
                      {product.description ? product.description.substring(0, 200) + (product.description.length > 200 ? "..." : "") : "Высококачественная продукция для полиграфии и творчества."}
                    </p>
                    <button
                      onClick={() => {
                        const descElement = document.getElementById('product-description');
                        descElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="text-[#005bff] text-[14px] font-bold hover:underline"
                    >
                      Подробнее
                    </button>
                  </div>

                  {/* Characteristics */}
                  <div>
                    <h3 className="text-[18px] font-bold text-[#212121] mb-4">Характеристики</h3>
                    <dl className="space-y-3">
                      <div className="flex justify-between text-[14px] border-b border-dashed border-[#e0e0e0] pb-1">
                        <dt className="text-[#808080]">Бренд</dt>
                        <dd className="text-[#212121] font-medium">{product.vendor || "Ярославская Бумага"}</dd>
                      </div>
                      <div className="flex justify-between text-[14px] border-b border-dashed border-[#e0e0e0] pb-1">
                        <dt className="text-[#808080]">Категория</dt>
                        <dd className="text-[#212121] font-medium">{product.category}</dd>
                      </div>
                      <div className="flex justify-between text-[14px] border-b border-dashed border-[#e0e0e0] pb-1">
                        <dt className="text-[#808080]">Страна</dt>
                        <dd className="text-[#212121] font-medium">Россия</dd>
                      </div>
                    </dl>
                    <button className="mt-4 text-[#005bff] text-[14px] font-bold hover:underline">Все характеристики</button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-5 bg-[#f2f3f5] rounded-xl border border-[#e0e0e0]">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className={cn("text-[32px] font-bold", product.oldPrice ? "text-[#f91155]" : "text-[#212121]")}>
                        {product.price.toFixed(0)} ₽
                      </span>
                      {product.oldPrice && (
                        <>
                          <span className="text-[18px] text-[#808080] line-through">
                            {product.oldPrice.toFixed(0)} ₽
                          </span>
                          <span className="text-[18px] text-[#f91155] font-bold">
                            -{discount}%
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-[13px] text-[#808080]">Цена за 1 шт.</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center bg-[#f2f3f5] rounded-lg p-1 w-fit border border-[#e0e0e0]">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center text-[#212121] hover:bg-white rounded-md transition-all font-bold text-xl"
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-bold text-[#212121]">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-[#212121] hover:bg-white rounded-md transition-all font-bold text-xl"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        for(let i=0; i<quantity; i++) {
                          addToCart({
                            id: numericId,
                            name: product.name,
                            category: product.category,
                            price: product.price,
                            image: product.image
                          });
                        }
                      }}
                      className="w-full h-12 bg-[#005bff] text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#004ed6] transition-all text-[16px] active:scale-[0.98]"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Добавить в корзину
                    </button>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-3 text-[14px]">
                      <Truck className="w-5 h-5 text-[#005bff]" />
                      <div>
                        <span className="font-bold text-[#212121]">Быстрая доставка</span>
                        <p className="text-[#808080]">Завтра, бесплатно</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-[14px]">
                      <RotateCcw className="w-5 h-5 text-[#005bff]" />
                      <div>
                        <span className="font-bold text-[#212121]">30 дней на возврат</span>
                        <p className="text-[#808080]">Бесплатно для постоянных клиентов</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div id="product-description" className="mt-8 bg-white rounded-2xl p-8 shadow-sm border border-[#e0e0e0]">
          <h3 className="text-[22px] font-bold text-[#212121] mb-6">Описание</h3>
          <p className="text-[#212121] leading-relaxed text-[16px] max-w-4xl">
            {product.description || "Высококачественная продукция для полиграфии и творчества. Идеально подходит для профессионального использования и хобби."}
          </p>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-[24px] font-bold text-[#212121] mb-6">Похожие товары</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((item, idx) => {
                const rNumericId = parseInt(item.id.slice(0, 8), 16) || idx;
                const rDiscount = item.oldPrice ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100) : 0;
                
                return (
                  <div
                    key={item.id}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 flex flex-col border border-[#f0f0f0]"
                  >
                    <div className="relative aspect-[3/4] bg-white overflow-hidden">
                      <Link to={`/product/${item.id}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                        />
                      </Link>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite({
                            id: rNumericId,
                            name: item.name,
                            category: item.category,
                            price: item.price,
                            image: item.image
                          });
                        }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white shadow-sm z-10"
                      >
                        <Heart className={cn("w-5 h-5 transition-colors", isFavorite(rNumericId) ? "text-[#f91155] fill-[#f91155]" : "text-[#212121] hover:text-[#f91155]")} />
                      </button>
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className={cn("text-[16px] font-bold", item.oldPrice ? "text-[#f91155]" : "text-[#212121]")}>
                          {item.price.toFixed(0)} ₽
                        </span>
                        {item.oldPrice && (
                          <span className="text-[12px] text-[#808080] line-through">
                            {item.oldPrice.toFixed(0)} ₽
                          </span>
                        )}
                      </div>
                      <Link to={`/product/${item.id}`}>
                        <h4 className="text-[13px] text-[#212121] leading-[16px] mb-2 line-clamp-3 hover:text-[#005bff] transition-colors h-[48px]">
                          {item.name}
                        </h4>
                      </Link>
                      <button 
                        onClick={() => addToCart({
                          id: rNumericId,
                          name: item.name,
                          category: item.category,
                          price: item.price,
                          image: item.image
                        })}
                        className="mt-auto w-full bg-[#005bff] hover:bg-[#004ed6] text-white rounded-lg py-2 px-4 text-[13px] font-bold transition-all"
                      >
                        В корзину
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Image Modal */}
        {isLightboxOpen && (
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all text-white z-60"
            >
              <X className="w-6 h-6" />
            </button>

            <div
              className="relative aspect-[3/4] w-full max-w-2xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Previous Button */}
              {product.images && product.images.length > 1 && (
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                  className="absolute left-0 -translate-x-16 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all text-white z-40"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              <img
                src={product.images?.[selectedImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />

              {/* Next Button */}
              {product.images && product.images.length > 1 && (
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-0 translate-x-16 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all text-white z-40"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
