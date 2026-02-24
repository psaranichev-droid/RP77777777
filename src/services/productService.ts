import axios from 'axios';

// Payload API URL - по умолчанию localhost:3000
const PAYLOAD_API_URL = import.meta.env.VITE_PAYLOAD_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: `${PAYLOAD_API_URL}/api`,
  timeout: 10000,
});

// ─── Image URL Helper ──────────────────────────
const getImageUrl = (imageData: any): string => {
  if (!imageData) return '/placeholder.jpg';

  // Если это объект с url (от Payload Media)
  if (typeof imageData === 'object' && imageData.url) {
    return imageData.url.startsWith('http') ? imageData.url : `${PAYLOAD_API_URL}${imageData.url}`;
  }

  // Если это строка
  if (typeof imageData === 'string') {
    if (imageData.startsWith('http')) return imageData;
    return `${PAYLOAD_API_URL}${imageData}`;
  }

  return '/placeholder.jpg';
};

// ─── Type Definitions ──────────────────────────
export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  images: string[];
  category: string;
  description: string;
  vendor: string;
  inStock?: boolean;
  quantity?: number;
}

export interface PayloadProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  old_price?: number;
  vendor?: string;
  main_image?: any;
  images?: any[];
  category?: any;
  in_stock?: boolean;
  quantity?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Products API ──────────────────────────
export const fetchProductsFromYML = async (
  _url?: string,
  categoryName?: string,
  _subcategoryName?: string
): Promise<Product[]> => {
  try {
    // Получаем товары с Payload API
    const response = await apiClient.get('/products', {
      params: {
        limit: 1000,
        where: categoryName ? { 'category.name': { equals: categoryName } } : undefined,
      },
    });

    if (response.data.docs && Array.isArray(response.data.docs)) {
      // Маппируем данные из Payload в формат Product
      return response.data.docs.map((item: PayloadProduct): Product => ({
        id: item.id,
        name: item.name,
        price: item.price,
        oldPrice: item.old_price,
        image: getImageUrl(item.main_image),
        images: item.images
          ? item.images.map((img: any) => getImageUrl(img.image || img))
          : [getImageUrl(item.main_image)],
        category: typeof item.category === 'object' ? item.category.name : item.category || 'Unknown',
        description: item.description || '',
        vendor: item.vendor || '',
        inStock: item.in_stock !== false,
        quantity: item.quantity || 0,
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await apiClient.get(`/products/${id}`);

    if (response.data) {
      const item = response.data;
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        oldPrice: item.old_price,
        image: getImageUrl(item.main_image),
        images: item.images
          ? item.images.map((img: any) => getImageUrl(img.image || img))
          : [getImageUrl(item.main_image)],
        category: typeof item.category === 'object' ? item.category.name : item.category || '',
        description: item.description || '',
        vendor: item.vendor || '',
        inStock: item.in_stock !== false,
        quantity: item.quantity || 0,
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get('/categories', {
      params: { limit: 1000 },
    });

    if (response.data.docs && Array.isArray(response.data.docs)) {
      return response.data.docs.map((cat: any) => cat.name || '');
    }

    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};
