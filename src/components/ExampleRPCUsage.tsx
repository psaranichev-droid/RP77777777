import { useEffect, useState } from 'react';
import { fetchProducts, fetchCategories, healthCheck } from '../lib/api';

/**
 * Example component showing how to use the type-safe RPC client
 *
 * Benefits of Hono RPC:
 * - Full TypeScript type inference for API responses
 * - IDE autocomplete for all API methods
 * - Zero runtime validation overhead
 * - Frontend and backend share the same type definitions
 */
export function ExampleRPCUsage() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // All of these are fully type-safe with autocomplete
        const healthResp = await healthCheck();
        setStatus(`Server uptime: ${healthResp.uptime.toFixed(2)}s`);

        // Fetch with pagination
        const productsResp = await fetchProducts(10, 0);
        setProducts(productsResp.products);

        // Fetch categories
        const categoriesResp = await fetchCategories();
        setCategories(categoriesResp.data);
      } catch (error) {
        console.error('RPC Error:', error);
        setStatus('Error loading data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Type-Safe RPC Example</h2>
      <p className="mb-4 text-sm text-gray-600">{status}</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Categories ({categories.length})</h3>
          <ul className="text-sm space-y-1">
            {categories.slice(0, 5).map((cat: any) => (
              <li key={cat.id}>{cat.name}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Products ({products.length})</h3>
          <ul className="text-sm space-y-1">
            {products.slice(0, 5).map((prod: any) => (
              <li key={prod.id}>{prod.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Key advantages over traditional REST:
 *
 * BEFORE (without RPC):
 * const response = await fetch('http://localhost:3001/api/products');
 * const data = await response.json(); // data type is 'any', no autocomplete
 *
 * AFTER (with RPC):
 * const response = await api.rpc.products.$get(...);
 * // response type is fully inferred, autocomplete works, type-safe ✓
 */
