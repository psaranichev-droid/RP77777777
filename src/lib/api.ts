import type { RPC } from '../../server/rpc';
import { hc } from 'hono/client';

/**
 * Type-safe API client for communicating with the backend
 * Uses Hono RPC for full end-to-end type safety
 */

const baseURL =
  import.meta.env.DEV && typeof window !== 'undefined'
    ? 'http://localhost:3001'
    : '';

// Create the RPC client with full type safety
export const api = hc<RPC>(baseURL);

/**
 * Fetch products with pagination
 * @example
 * const { products, total } = await fetchProducts(10, 0);
 */
export async function fetchProducts(limit: number = 100, offset: number = 0) {
  const response = await api.rpc.products.$get({
    query: {
      limit: limit.toString(),
      offset: offset.toString(),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch single product by ID or external_id
 * @example
 * const product = await fetchProduct('product-123');
 */
export async function fetchProduct(id: string) {
  const response = await api.rpc.products[':id'].$get({
    param: { id },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch all categories
 * @example
 * const { data: categories } = await fetchCategories();
 */
export async function fetchCategories() {
  const response = await api.rpc.categories.$get();

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`);
  }

  return response.json();
}

/**
 * Check server health
 * @example
 * const { success, uptime } = await healthCheck();
 */
export async function healthCheck() {
  const response = await api.rpc.health.$get();

  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }

  return response.json();
}

export default api;
