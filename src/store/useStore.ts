import { create } from 'zustand';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, delta: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
}

interface FavoritesStore {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
}

export const useCart = create<CartStore>((set, get) => ({
  cart: [],
  addToCart: (product) => {
    const currentCart = get().cart;
    const existingItem = currentCart.find((item) => item.id === product.id);

    if (existingItem) {
      set({
        cart: currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      });
    } else {
      set({ cart: [...currentCart, { ...product, quantity: 1 }] });
    }
  },
  removeFromCart: (productId) =>
    set({ cart: get().cart.filter((item) => item.id !== productId) }),
  updateQuantity: (productId, delta) => {
    set({
      cart: get().cart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      ),
    });
  },
  clearCart: () => set({ cart: [] }),
  totalPrice: () => get().cart.reduce((total, item) => total + item.price * item.quantity, 0),
}));

export const useFavorites = create<FavoritesStore>((set, get) => ({
  favorites: [],
  toggleFavorite: (product) => {
    const currentFavorites = get().favorites;
    const isAlreadyFavorite = currentFavorites.some((item) => item.id === product.id);

    if (isAlreadyFavorite) {
      set({ favorites: currentFavorites.filter((item) => item.id !== product.id) });
    } else {
      set({ favorites: [...currentFavorites, product] });
    }
  },
  isFavorite: (productId) => get().favorites.some((item) => item.id === productId),
}));
