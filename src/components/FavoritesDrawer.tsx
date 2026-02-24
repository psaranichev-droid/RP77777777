import { AnimatePresence, motion } from 'framer-motion';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites, useCart } from '../store/useStore';
import { overlay, drawer } from '../utils/animations';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FavoritesDrawer = ({ isOpen, onClose }: FavoritesDrawerProps) => {
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div {...overlay} onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]" />
          <motion.div
            {...drawer}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                <h2 className="text-xl font-bold font-rubik">Избранное</h2>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-sm font-medium">
                  {favorites.length}
                </span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {favorites.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                    <Heart className="w-10 h-10 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-slate-900">Список избранного пуст</p>
                    <p className="text-slate-500">Сохраняйте товары, которые вам понравились</p>
                  </div>
                  <button onClick={onClose} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors duration-200">
                    Перейти к покупкам
                  </button>
                </div>
              ) : (
                favorites.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 first:pt-0 border-b border-slate-100 last:border-0">
                    <Link 
                      to={`/product/${item.id}`} 
                      onClick={onClose}
                      className="w-24 aspect-[3/4] bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 group"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110" 
                      />
                    </Link>
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <Link 
                          to={`/product/${item.id}`}
                          onClick={onClose}
                          className="text-[14px] font-medium text-slate-900 leading-tight hover:text-indigo-600 transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <button 
                          onClick={() => toggleFavorite(item)} 
                          className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all flex-shrink-0"
                          title="Удалить из избранного"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <p className="text-[12px] text-slate-400 mb-auto">{item.category}</p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[16px] font-bold text-slate-900">{item.price.toFixed(0)} ₽</span>
                        <button
                          onClick={() => { addToCart(item); onClose(); }}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-[13px] font-bold rounded-lg hover:bg-indigo-700 transition-all active:scale-[0.98] shadow-sm"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          В корзину
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
