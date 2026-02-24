import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ShoppingCart, Heart, Menu, X, ArrowRight, Package, Phone, Mail, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';
import { useCart, useFavorites } from '../store/useStore';
import { CartDrawer } from './CartDrawer';
import { FavoritesDrawer } from './FavoritesDrawer';
import { DURATION, EASE } from '../utils/animations';

// ─── Данные ───────────────────────────────────────────
const NAV_LINKS = [
  { name: 'Оптовые цены', path: '/wholesale' },
  { name: 'Шоурум', path: '/showroom' },
  { name: 'Дизайнерская бумага', path: '/designer-paper' },
  { name: 'Индивидуальная резка', path: '/cutting' },
] as const;

const SERVICE_LINKS = [
  { name: 'Оплата', path: '/payment' },
  { name: 'Возврат', path: '/returns' },
  { name: 'Доставка', path: '/delivery' },
  { name: 'Реквизиты', path: '/details' },
] as const;

const POPULAR_SEARCHES = ['Дизайнерская бумага', 'Крафт бумага', 'Калька', 'Картон переплетный'];
const RECENT_SEARCHES = ['Бумага для акварели', 'Конверты'];

const SEARCH_SUGGESTIONS = [
  { name: 'Бумага Fedrigoni', category: 'Дизайнерская бумага', price: 'от 120 ₽' },
  { name: 'Крафт-бумага 120 г/м²', category: 'Крафт', price: 'от 45 ₽' },
  { name: 'Калька Premium', category: 'Калька', price: 'от 85 ₽' },
  { name: 'Картон переплетный 2мм', category: 'Картон', price: 'от 150 ₽' },
  { name: 'Бумага с тиснением', category: 'Текстурная', price: 'от 200 ₽' },
];

const CATALOG = [
  {
    id: 'offset',
    title: 'Офсетная бумага',
    subcategories: [
      { name: 'Высокой плотности', items: ['200 г/м²', '250 г/м²', '300 г/м²'] },
      { name: 'Повышенный плотности', items: ['160 г/м²', '170 г/м²', '180 г/м²'] },
      { name: 'Стандартный плотности', items: ['80 г/м²', '100 г/м²', '120 г/м²'] },
    ],
  },
  {
    id: 'coated',
    title: 'Мелованная бумага',
    subcategories: [
      { name: 'Глянцевая', items: ['90 г/м²', '115 г/м²', '130 г/м²', '150 г/м²', '170 г/м²', '200 г/м²', '250 г/м²', '300 г/м²'] },
      { name: 'Матовая', items: ['90 г/м²', '115 г/м²', '130 г/м²', '150 г/м²', '170 г/м²', '200 г/м²', '250 г/м²', '300 г/м²'] },
    ],
  },
  {
    id: 'designer',
    title: 'Дизайнерская Бумага',
    subcategories: [
      { name: 'Knight Color', items: [] },
      { name: 'Rubber Like', items: [] },
      { name: 'Galaxy Metallic', items: [] },
      { name: 'Fiber Art', items: [] },
      { name: 'Color Style Smooth', items: [] },
      { name: 'Knight Black', items: [] },
    ],
  },
  {
    id: 'cardboard',
    title: 'Картон',
    subcategories: [
      { name: 'Мелованый', items: [] },
    ],
  },
  {
    id: 'blanks',
    title: 'Заготовки',
    subcategories: [
      { name: 'Карточки', items: [] },
    ],
  },
];

const FAST = { duration: DURATION.fast, ease: EASE.out } as const;
const SCROLL_THRESHOLD = 10;
const INACTIVITY_TIMEOUT = 60_000;

// ─── Компонент ────────────────────────────────────────
export const Header: React.FC = () => {
  const { pathname } = useLocation();

  // UI State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [activeCatalogIndex, setActiveCatalogIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  // Store
  const cartCount = useCart((s) => s.cart.length);
  const wishlistCount = useFavorites((s) => s.favorites.length);

  // Refs
  const searchRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = (path: string) => pathname === path;
  const isMenuOpen = isCatalogOpen || isSearchFocused || isMobileMenuOpen;

  // ─── Scroll Logic ─────────────────────────────────
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;

        if (y < 80) {
          setIsHeaderVisible(true);
          setIsScrolled(false);
        } else {
          setIsScrolled(true);
          if (!isMenuOpen) {
            const diff = lastScrollY.current - y;
            if (diff > SCROLL_THRESHOLD) setIsHeaderVisible(true);
            else if (diff < -SCROLL_THRESHOLD) setIsHeaderVisible(false);
          }
        }

        lastScrollY.current = y;
        ticking = false;
      });
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMenuOpen]);

  // ─── Inactivity Timer ─────────────────────────────
  const resetInactivity = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => setIsHeaderVisible(true), INACTIVITY_TIMEOUT);
  }, []);

  useEffect(() => {
    const events = ['mousemove', 'scroll', 'mousedown', 'keydown', 'touchstart'] as const;
    const handler = () => resetInactivity();

    events.forEach((e) => window.addEventListener(e, handler, { passive: true }));
    resetInactivity();

    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [resetInactivity]);

  // ─── Click Outside ────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!catalogRef.current?.contains(target) && !megaMenuRef.current?.contains(target)) {
        setIsCatalogOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ─── Search filtering ─────────────────────────────
  const filteredSuggestions = searchQuery
    ? SEARCH_SUGGESTIONS.filter(
        (i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEARCH_SUGGESTIONS;

  // ─── Render ───────────────────────────────────────
  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {(isSearchFocused || isCatalogOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={FAST}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
            onClick={() => { setIsSearchFocused(false); setIsCatalogOpen(false); }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header
        className={cn(
          'sticky top-0 z-50 bg-white transition-all duration-200',
          isScrolled ? 'shadow-lg' : 'shadow-sm',
          !isHeaderVisible && '-translate-y-full'
        )}
      >
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white hidden sm:block">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-10">
              <div className="flex items-center gap-6">
                {SERVICE_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'text-xs font-medium transition-colors',
                      isActive(link.path) ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="flex items-center divide-x divide-slate-700">
                <a href="tel:+79101066003" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-xs font-semibold pr-4">
                  <Phone className="w-3.5 h-3.5" />
                  +7 (910) 106-60-03
                </a>
                <a href="mailto:info@onlook.ru" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-xs font-semibold pl-4">
                  <Mail className="w-3.5 h-3.5" />
                  info@onlook.ru
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Bar */}
        <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
          <div className="flex items-center h-20 gap-8">
            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2.5 -ml-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Открыть меню"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
                <Package className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-rubik">Бумага</span>
                <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase -mt-0.5 font-rubik">дизайн-бутик</span>
              </div>
            </Link>

            {/* Catalog */}
            <div ref={catalogRef}>
              <button
                onClick={() => setIsCatalogOpen((v) => !v)}
                className={cn(
                  'hidden md:flex items-center justify-center gap-2 px-6 h-12 text-sm font-semibold rounded-xl transition-all active:scale-[0.98]',
                  isCatalogOpen
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                )}
              >
                {isCatalogOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
                КАТАЛОГ
              </button>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-4xl relative z-50" ref={searchRef}>
              <div className={cn(
                'relative w-full h-12 flex items-center transition-all duration-200 rounded-xl bg-slate-100/80 border-2 border-transparent',
                isSearchFocused && 'bg-white border-slate-200 shadow-xl rounded-b-none'
              )}>
                <Search className="w-5 h-5 text-slate-400 ml-4 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Найти дизайнерскую бумагу..."
                  className="w-full bg-transparent border-none outline-none py-3 px-3 text-sm text-slate-900 placeholder:text-slate-400 pr-10"
                  onFocus={() => setIsSearchFocused(true)}
                />
              </div>

              {/* Search Dropdown */}
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={FAST}
                    className="absolute top-full left-0 right-0 bg-white border-2 border-t-0 border-slate-200 rounded-b-xl shadow-2xl z-50 overflow-hidden"
                  >
                    {searchQuery.length === 0 && (
                      <>
                        <div className="p-3 border-b border-slate-100">
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                            <Clock className="w-3.5 h-3.5" />
                            Недавние запросы
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {RECENT_SEARCHES.map((term) => (
                              <button key={term} onClick={() => setSearchQuery(term)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-lg transition-colors">
                                {term}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="p-3 border-b border-slate-100">
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                            <TrendingUp className="w-3.5 h-3.5" />
                            Популярные запросы
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {POPULAR_SEARCHES.map((term) => (
                              <button key={term} onClick={() => setSearchQuery(term)} className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm rounded-lg transition-colors">
                                {term}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="p-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2 pt-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        {searchQuery ? 'Результаты' : 'Рекомендуем'}
                      </div>
                      <div className="space-y-1">
                        {filteredSuggestions.slice(0, 5).map((item) => (
                          <button
                            key={item.name}
                            onClick={() => { setSearchQuery(item.name); setIsSearchFocused(false); }}
                            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-slate-400" />
                              </div>
                              <div className="text-left">
                                <div className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{item.name}</div>
                                <div className="text-xs text-slate-400">{item.category}</div>
                              </div>
                            </div>
                            <div className="text-sm font-semibold text-slate-600">{item.price}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {searchQuery && (
                      <div className="p-3 bg-slate-50 border-t border-slate-100">
                        <button className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                          Показать все результаты по запросу «{searchQuery}»
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={() => setIsFavoritesOpen(true)}
                className="relative p-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
                aria-label="Избранное"
              >
                <Heart className={cn('w-5 h-5', wishlistCount > 0 && 'fill-rose-500 text-rose-500')} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
                aria-label="Корзина"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="hidden lg:block border-t border-slate-100">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
            <nav className="flex items-center gap-1 h-12">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'relative px-4 h-full flex items-center text-sm font-medium transition-colors',
                    isActive(item.path)
                      ? 'text-indigo-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  {item.name}
                  {isActive(item.path) && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Mega Menu */}
        <AnimatePresence>
          {isCatalogOpen && (
            <motion.div
              ref={megaMenuRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={FAST}
              className="absolute left-0 right-0 w-full bg-white border-t border-slate-100 shadow-2xl z-50"
            >
              <div className="max-w-[1440px] mx-auto px-6 lg:px-8 flex h-[480px]">
                {/* Left nav */}
                <div className="w-[280px] border-r border-slate-100 py-8 pr-6 shrink-0">
                  <div className="space-y-1">
                    {CATALOG.map((cat, i) => (
                      <button
                        key={cat.title}
                        onMouseEnter={() => setActiveCatalogIndex(i)}
                        className={cn(
                          'w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all text-left group border',
                          activeCatalogIndex === i
                            ? 'bg-white text-indigo-600 shadow-sm border-slate-200/60 ring-1 ring-slate-100'
                            : 'border-transparent text-slate-600 hover:bg-white/60 hover:text-slate-900'
                        )}
                      >
                        <span className="text-[15px] font-semibold">{cat.title}</span>
                        <ArrowRight className={cn(
                          'w-4 h-4 transition-all duration-200',
                          activeCatalogIndex === i ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-40'
                        )} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right content */}
                <div className="flex-1 py-8 pl-10 pr-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCatalogIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={FAST}
                      className="grid grid-cols-3 gap-x-10 gap-y-10"
                    >
                      {CATALOG[activeCatalogIndex].subcategories.map((sub) => (
                        <div key={sub.name} className="space-y-4">
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] pb-2 border-b border-slate-100">
                            {sub.name}
                          </h4>
                          <ul className="space-y-3">
                            {sub.items.map((item) => (
                              <li key={item}>
                                <Link 
                                  to={`/catalog?cat=${CATALOG[activeCatalogIndex].id}`}
                                  onClick={() => setIsCatalogOpen(false)}
                                  className="text-[14px] text-slate-600 hover:text-indigo-600 hover:translate-x-1 transition-all flex items-center gap-2.5 group"
                                >
                                  <div className="w-1 h-1 rounded-full bg-slate-200 group-hover:bg-indigo-400 transition-all" />
                                  <span className="group-hover:font-medium transition-all">{item}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Search */}
      <div className="md:hidden px-4 py-3 bg-slate-50 border-b border-slate-100">
        <div className="relative flex items-center rounded-xl bg-white border border-slate-200 transition-all">
          <Search className="w-5 h-5 text-slate-400 ml-3" />
          <input type="text" placeholder="Поиск..." className="w-full bg-transparent border-none outline-none py-2.5 px-3 text-sm" />
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-5 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center text-white">
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-bold text-slate-900">Бумага</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors" aria-label="Закрыть меню">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Меню</p>
                  <div className="space-y-1">
                    {NAV_LINKS.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center justify-between p-3.5 rounded-xl transition-colors',
                          isActive(item.path) ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-700'
                        )}
                      >
                        <span className="font-medium">{item.name}</span>
                        <ArrowRight className="w-4 h-4 opacity-40" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="p-5 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Контакты</p>
                  <div className="space-y-3">
                    <a href="tel:+79101066003" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                      <Phone className="w-5 h-5 text-slate-400" />
                      <span className="font-medium text-slate-900">+7 (910) 106-60-03</span>
                    </a>
                    <a href="mailto:info@onlook.ru" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                      <Mail className="w-5 h-5 text-slate-400" />
                      <span className="font-medium text-slate-900">info@onlook.ru</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-slate-100 bg-slate-50">
                <button className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors">
                  Каталог товаров
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <FavoritesDrawer isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} />
    </>
  );
};