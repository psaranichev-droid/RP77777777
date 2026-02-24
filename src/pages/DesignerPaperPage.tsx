import Hero from '../components/Hero';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Heart, ShoppingCart, Info, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProductsFromYML, Product } from '../services/productService';
import { useCart, useFavorites } from '../store/useStore';
import { cn } from '../utils/cn';

const YML_URL = "https://yastore-prod-persist.s3.yandex.net/feeds/yml/019a4608-b88b-7916-8afb-3558dd6d2eda.xml";

const collections = [
  {
    title: "Knight Color",
    desc: "Целлюлозные тонированные в массе художественные бумаги, глубоких, ярких тонов",
    image: "https://images.unsplash.com/photo-1586075010623-26c50dec4a45?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Rubber Like",
    desc: "Коллекция бумаги с матовым покрытием, напоминающим резину",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Galaxy Metallic",
    desc: "Окрашенная в массе дизайнерская бумага с металлизированным покрытием",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Fiber Art",
    desc: "Коллекция немелованных дизайнерских бумаг в натуральных природных оттенках",
    image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Color Style Smooth",
    desc: "Тонированные в массе дизайнерские бумаги и картоны насыщенного чёрного цвета",
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Knight Black",
    desc: "Коллекция чистоцеллюлозной тонированной в массе, гладкой дизайнерской бумаги пастельных оттенков",
    image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=800"
  }
];

const steps = [
  {
    num: "1",
    title: "Определитесь с видами дизайнерской бумаги",
    desc: "Для начала нужно изучить образцы и каталоги дизайнерской бумаги в нашем шоуруме, находящемся по адресу: Нижний Новгород, ул. Баумана, д. 48к1."
  },
  {
    num: "2",
    title: "Проверка наличия остатков",
    desc: "Мы используем специальную программу, чтобы проверить наличие бумаги на нашем складе и складах поставщиков."
  },
  {
    num: "3",
    title: "Расчёт стоимости",
    desc: "Уточняем все детали Вашего заказа: резка, упаковка, доставка, торговое предложение и в итоге озвучиваем Вам полную стоимость заказа."
  },
  {
    num: "4",
    title: "Оформление заказа",
    desc: "Если все условия Вас устраивают, то тогда на этом этапе Вы осуществляете оплату заказа тем путем, который мы ранее с Вами обсудили."
  },
  {
    num: "5",
    title: "Ждём доставку бумаги от поставщика",
    desc: "Срок доставки составляет от 1 дня до 4 недель. В любом случае вы будете знать заранее, когда бумага поступит от поставщика к нам."
  },
  {
    num: "6",
    title: "Приёмка и осмотр бумаги",
    desc: "Когда бумага пришла от поставщика, мы её тщательно осматриваем. Если есть повреждения, делаем фото/видео фиксацию."
  },
  {
    num: "7",
    title: "Резка бумаги",
    desc: "Осуществляем резку Вашей бумаги на нашем профессиональном оборудовании в нужные размеры."
  },
  {
    num: "8",
    title: "Упаковка",
    desc: "Упакуем готовую нарезанную бумагу в ту упаковку, которую мы согласовали на этапе Расчёт стоимости."
  },
  {
    num: "9",
    title: "Доставка или Самовывоз",
    desc: "Осуществляем доставку собственными силами или через транспортные/курьерские компании, также возможен самовывоз из шоурума."
  },
  {
    num: "10",
    title: "Подписание документов",
    desc: "Для юридических лиц выставляем УПД с НДС, для физических — высылаем электронный чек на почту или в мессенджер."
  }
];

const DesignerPaperPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProductsFromYML(YML_URL, "Дизайнерская бумага");
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, []);

  return (
    <div className="bg-white">
      <Hero
        title={`Ищете, где купить
дизайнерскую бумагу?`}
        description="Мы создаём красивые и притягательные проекты. Разрабатываем сервис, который помогает людям развивать бизнес и совершенствовать рабочие процессы."
        backgroundImage="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=2000"
        overlayColor="bg-indigo-950/80"
        buttons={[
          { label: 'Смотреть каталог', href: '/catalog', primary: true },
          { label: 'Посетить шоурум', href: '/showroom' }
        ]}
      />

      {/* Каталог товаров */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-sm font-bold text-indigo-600 tracking-wider uppercase mb-3">Каталог</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-rubik tracking-normal">Дизайнерская бумага в наличии</h3>
            <p className="text-lg text-slate-600 font-inter leading-relaxed">
              Ознакомьтесь с актуальным ассортиментом дизайнерской бумаги, доступной для заказа прямо сейчас.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-14 h-14 text-[#005bff] animate-spin" />
                <p className="text-[#808080] text-[16px]">Загрузка товаров...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product, idx) => {
                const numericId = parseInt(product.id.slice(0, 8), 16) || idx;
                const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white rounded-xl border border-transparent hover:border-[#e0e0e0] overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
                  >
                    <div className="relative aspect-[3/4] bg-white overflow-hidden">
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
          )}
        </div>
      </section>

      {/* Коллекции */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-sm font-bold text-indigo-600 tracking-wider uppercase mb-3">Коллекции</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-rubik tracking-normal">Коллекции дизайнерской бумаги</h3>
            <p className="text-lg text-slate-600 font-inter leading-relaxed">
              Выбирать дизайнерскую бумагу по картинке в интернете рискованно, потому что цвета на экране искажаются, текстура не видна, а итоговая печать способна разочаровать.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {collections.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 transition-all group overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Content Section */}
                <div className="p-8 flex-1 flex flex-col">
                  <h4 className="text-2xl font-bold text-slate-900 mb-3 font-rubik tracking-normal">{item.title}</h4>
                  <p className="text-slate-600 leading-relaxed font-inter mb-8 flex-1">{item.desc}</p>
                  <button className="text-indigo-600 font-bold flex items-center gap-2 hover:gap-3 transition-all group-hover:text-indigo-700">
                    Подробнее <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-10 rounded-[2.5rem] bg-indigo-50 border border-indigo-100">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2 font-rubik tracking-normal">Важно знать!</h4>
                <p className="text-slate-700 font-inter leading-relaxed">
                  Выбирать дизайнерскую бумагу по картинке в интернете рискованно — цвета на экране искажаются, текстура не видна, а итоговая печать способна разочаровать. Рекомендуем посетить наш шоурум и оценить образцы лично.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Процесс */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-3">Процесс</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-rubik tracking-normal">Этапы работ</h3>
            <p className="text-slate-600 text-lg font-inter">Расписали для Вас совершенно ясную и понятную структуру этапов работы</p>
          </div>

          <div className="relative">
            {/* Central Vertical Line (Desktop) */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2 border-l-2 border-dashed border-slate-300"></div>

            <div className="space-y-16">
              {steps.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className={`flex flex-col lg:flex-row items-center ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* Content */}
                    <div className="w-full lg:w-1/2 lg:px-12 mb-8 lg:mb-0">
                      <motion.div 
                        initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className={`bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group ${idx % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}
                      >
                        <div className={`flex items-center gap-4 mb-4 ${idx % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                          <span className="text-sm font-bold text-indigo-500 uppercase tracking-widest font-inter">Шаг {step.num}</span>
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-4 font-rubik tracking-normal">{step.title}</h4>
                        <p className="text-slate-600 leading-relaxed font-inter">{step.desc}</p>
                      </motion.div>
                    </div>

                    {/* Step Number Badge on the Line (Desktop) */}
                    <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white border-4 border-indigo-600 rounded-full z-10 items-center justify-center text-indigo-600 font-bold text-sm shadow-xl">
                      {step.num}
                    </div>

                    {/* Empty half for desktop layout */}
                    <div className="hidden lg:block lg:w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DesignerPaperPage;
