/** Product fields returned by the Express API after it reads Firestore. */
export type Product = {
  id: string;
  name: string;
  /** Category key stored with this product in Firestore. */
  category: string;
  categoryName: string;
  placeholder: string;
  price: number;
  color: 'blue-flower' | 'sun-flower' | 'red-flower';
  motif: string;
  description: string;
  featured: boolean;
  imageUrl?: string | null;
  sortOrder?: number;
};
