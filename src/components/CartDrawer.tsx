import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../store/useStore';
import { overlay, drawer } from '../utils/animations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

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
                <ShoppingBag className="w-6 h-6 text-slate-900" />
                <h2 className="text-xl font-bold font-rubik">Корзина</h2>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-sm font-medium">
                  {cart.length}
                </span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-slate-900">Ваша корзина пуста</p>
                    <p className="text-slate-500">Добавьте что-нибудь из каталога</p>
                  </div>
                  <button onClick={onClose} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors duration-200">
                    Вернуться к покупкам
                  </button>
                </div>
              ) : (
                cart.map((item) => (
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
                          onClick={() => removeFromCart(item.id)} 
                          className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all flex-shrink-0"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <p className="text-[12px] text-slate-400 mb-auto">{item.category}</p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200/50">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)} 
                            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm rounded-md transition-all disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-[13px] font-bold text-slate-900">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)} 
                            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm rounded-md transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="block text-[16px] font-bold text-slate-900">{(item.price * item.quantity).toFixed(0)} ₽</span>
                          {item.quantity > 1 && (
                            <span className="block text-[11px] text-slate-400">{item.price.toFixed(0)} ₽ / шт.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="text-slate-500">Итого:</span>
                  <span className="font-bold text-slate-900 text-2xl">{totalPrice()} ₽</span>
                </div>
                <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-colors duration-200 shadow-lg shadow-indigo-200">
                  Оформить заказ
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
