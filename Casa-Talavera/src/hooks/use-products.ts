import { useCallback, useEffect, useState } from 'react';

import type { Product } from '@/data/products';
import { fetchProducts } from '@/services/products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrentRequest = true;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchProducts();
        if (isCurrentRequest) setProducts(result);
      } catch (cause) {
        if (isCurrentRequest) {
          setError(cause instanceof Error ? cause.message : 'Could not load the product catalog.');
        }
      } finally {
        if (isCurrentRequest) setIsLoading(false);
      }
    }

    void load();
    return () => {
      isCurrentRequest = false;
    };
  }, [reloadKey]);

  const retry = useCallback(() => setReloadKey((current) => current + 1), []);

  return { products, isLoading, error, retry };
}
