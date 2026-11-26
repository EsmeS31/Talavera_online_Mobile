import type { Product } from '@/data/products';

function getApiBaseUrl() {
  const value = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/$/, '');
  if (!value) {
    throw new Error(
      'Set EXPO_PUBLIC_API_URL in Casa-Talavera/.env to the address of your Express server, then restart Expo.',
    );
  }
  return value;
}

async function readError(response: Response) {
  try {
    const body = (await response.json()) as { error?: string };
    if (body.error) return body.error;
  } catch {
    // Use the status message below when the server did not return JSON.
  }
  return `The product server returned ${response.status}.`;
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${getApiBaseUrl()}/api/products`);
  if (!response.ok) throw new Error(await readError(response));
  const products = (await response.json()) as Product[];
  if (!Array.isArray(products)) throw new Error('The product server returned an invalid catalog.');
  return products;
}

export async function fetchProduct(id: string): Promise<Product | null> {
  const response = await fetch(`${getApiBaseUrl()}/api/products/${encodeURIComponent(id)}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(await readError(response));
  return (await response.json()) as Product;
}
