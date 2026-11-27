import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Product } from '@/data/products';
import { useProducts } from '@/hooks/use-products';

const C = {
  white: '#FEFEFE',
  lightBlue: '#E7E9F0',
  darkBlue: '#051747',
  mediumBlue: '#535F80',
  deepBlue: '#081F62',
};

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

function productBorderColor(product: Product) {
  if (product.color === 'sun-flower') return C.mediumBlue;
  if (product.color === 'red-flower') return C.darkBlue;
  return C.deepBlue;
}

function productRows(products: Product[]) {
  const rows: Product[][] = [];
  for (let index = 0; index < products.length; index += 2) {
    rows.push(products.slice(index, index + 2));
  }
  return rows;
}

export default function ShopScreen() {
  const { products, isLoading, error, retry } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [bag, setBag] = useState<Record<string, number>>({});

  const categories = useMemo(() => {
    const labels = new Map<string, string>();
    products.forEach((product) => {
      const id = product.category?.trim() || product.categoryName.trim().toLowerCase().replace(/\s+/g, '-');
      const label = product.categoryName?.trim() || product.category;
      if (id && label && !labels.has(id)) labels.set(id, label);
    });
    return [{ id: null, label: 'All' }, ...Array.from(labels, ([id, label]) => ({ id, label }))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === null || product.category === category;
      const searchableText = `${product.name} ${product.categoryName} ${product.description}`.toLowerCase();
      return matchesCategory && (!query || searchableText.includes(query));
    });
  }, [category, products, search]);

  const bagCount = Object.values(bag).reduce((total, quantity) => total + quantity, 0);

  function addToBag(productId: string) {
    setBag((current) => ({ ...current, [productId]: (current[productId] ?? 0) + 1 }));
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}><Text style={styles.logoMark}>✦ </Text>Casa <Text style={styles.logoItalic}>Talavera</Text></Text>
          <Text style={styles.bagLabel}>Bag ({bagCount})</Text>
        </View>

        <View style={styles.collection}>
          <Text style={styles.eyebrow}>Shop Talavera</Text>
          <Text style={styles.title}>Bring color to the everyday.</Text>
          <Text style={styles.intro}>Hand-painted ceramics, made slowly in Puebla, Mexico.</Text>

          <Text style={styles.searchLabel}>Search the catalog</Text>
          <TextInput
            accessibilityLabel="Search the catalog"
            value={search}
            onChangeText={setSearch}
            placeholder="Search by product name"
            placeholderTextColor={C.mediumBlue}
            returnKeyType="search"
            selectionColor={C.deepBlue}
            style={styles.searchInput}
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
            {categories.map((item) => {
              const selected = category === item.id;
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setCategory(item.id)}
                  style={({ pressed }) => [
                    styles.filterButton,
                    selected && styles.selectedFilter,
                    pressed && styles.pressed,
                  ]}>
                  <Text style={[styles.filterText, selected && styles.selectedFilterText]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={styles.resultsCount} accessibilityLiveRegion="polite">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
          </Text>

          {isLoading && <Text style={styles.statusText}>Loading products from the shop…</Text>}
          {error && (
            <View style={styles.statusCard}>
              <Text style={styles.emptyTitle}>Catalog unavailable</Text>
              <Text style={styles.emptyText}>{error}</Text>
              <Pressable onPress={retry}><Text style={styles.resetLink}>Try again</Text></Pressable>
            </View>
          )}

          {!isLoading && !error && filteredProducts.length > 0 ? (
            <View style={styles.productGrid}>
              {productRows(filteredProducts).map((row) => (
                <View key={row[0].id} style={styles.productRow}>
                  {row.map((product) => {
                    const quantity = bag[product.id] ?? 0;
                    return (
                      <View key={product.id} style={styles.productCard}>
                        <Link href={{ pathname: '/products/[id]', params: { id: product.id } }} asChild>
                          <Pressable
                            accessibilityRole="link"
                            accessibilityLabel={`View ${product.name} details`}
                            style={({ pressed }) => [styles.detailsLink, pressed && styles.pressed]}>
                            <View style={[styles.productArt, { borderColor: productBorderColor(product) }]}>
                              {product.imageUrl ? (
                                <Image source={{ uri: product.imageUrl }} style={styles.productPhoto} contentFit="cover" />
                              ) : (
                                <View style={[styles.artInner, product.color === 'sun-flower' && styles.sunArt]}>
                                  <Text style={[styles.motif, { color: productBorderColor(product) }]}>{product.motif}</Text>
                                  <Text style={styles.placeholder}>{product.placeholder}</Text>
                                </View>
                              )}
                            </View>
                            <Text style={styles.productCategory}>{product.categoryName}</Text>
                            <View style={styles.productHeading}>
                              <Text style={styles.productName}>{product.name}</Text>
                              <Text style={styles.price}>{formatPrice(product.price)}</Text>
                            </View>
                            <Text style={styles.description}>{product.description}</Text>
                          </Pressable>
                        </Link>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Add ${product.name} to bag`}
                          onPress={() => addToBag(product.id)}
                          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}>
                          <Text style={styles.addButtonText}>
                            {quantity > 0 ? `Added · ${quantity}  + Add again` : 'Add to bag'}
                          </Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          ) : (!isLoading && !error && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No pieces found</Text>
              <Text style={styles.emptyText}>Try another name or choose a different category.</Text>
              <Pressable onPress={() => { setSearch(''); setCategory(null); }}>
                <Text style={styles.resetLink}>Clear search and filters</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.white },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingBottom: 32 },
  header: { minHeight: 64, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: C.lightBlue, backgroundColor: C.white },
  logo: { color: C.darkBlue, fontFamily: 'Georgia', fontSize: 20, fontWeight: '700' },
  logoMark: { color: C.deepBlue },
  logoItalic: { color: C.mediumBlue, fontStyle: 'italic' },
  bagLabel: { color: C.darkBlue, fontWeight: '700', fontSize: 13 },
  collection: { backgroundColor: C.lightBlue, paddingHorizontal: 22, paddingTop: 33, paddingBottom: 32 },
  eyebrow: { color: C.mediumBlue, fontSize: 10, fontWeight: '800', letterSpacing: 1.8, textTransform: 'uppercase' },
  title: { color: C.darkBlue, fontFamily: 'Georgia', fontSize: 32, lineHeight: 38, fontWeight: '700', marginTop: 8 },
  intro: { color: C.darkBlue, fontSize: 13, lineHeight: 20, marginTop: 8 },
  searchLabel: { color: C.darkBlue, fontSize: 14, fontWeight: '700', marginTop: 25, marginBottom: 8 },
  searchInput: { width: '100%', minHeight: 48, paddingHorizontal: 13, borderWidth: 1, borderColor: C.mediumBlue, backgroundColor: C.white, color: C.darkBlue, fontSize: 14 },
  filters: { gap: 9, paddingTop: 13, paddingBottom: 3 },
  filterButton: { paddingVertical: 9, paddingHorizontal: 13, borderWidth: 1, borderColor: C.darkBlue, backgroundColor: C.white },
  selectedFilter: { backgroundColor: C.darkBlue },
  filterText: { color: C.darkBlue, fontSize: 12, fontWeight: '600' },
  selectedFilterText: { color: C.white },
  pressed: { opacity: 0.72 },
  statusText: { color: C.mediumBlue, fontSize: 13, paddingVertical: 18 },
  statusCard: { alignItems: 'center', paddingHorizontal: 20, paddingVertical: 30, backgroundColor: C.white, marginTop: 6 },
  resultsCount: { color: C.mediumBlue, fontSize: 12, marginTop: 14, marginBottom: 13 },
  productGrid: { gap: 22 },
  productRow: { flexDirection: 'row', alignItems: 'stretch', gap: 12 },
  productCard: { flex: 1, minWidth: 0, display: 'flex' },
  detailsLink: { flex: 1 },
  productArt: { width: '100%', aspectRatio: 0.92, borderWidth: 8, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center', padding: 5 },
  productPhoto: { width: '100%', height: '100%' },
  artInner: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: C.white },
  sunArt: { backgroundColor: C.lightBlue },
  motif: { fontSize: 66 },
  placeholder: { position: 'absolute', bottom: 8, color: C.mediumBlue, fontSize: 9, backgroundColor: C.white, paddingHorizontal: 5 },
  productCategory: { color: C.mediumBlue, fontSize: 9, fontWeight: '800', letterSpacing: 1, marginTop: 11, textTransform: 'uppercase' },
  productHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 5, marginTop: 4, minHeight: 54 },
  productName: { flex: 1, color: C.darkBlue, fontSize: 13, fontWeight: '700', lineHeight: 18 },
  price: { color: C.mediumBlue, fontSize: 12, fontWeight: '700' },
  description: { color: C.mediumBlue, fontSize: 10, lineHeight: 15, marginTop: 6, minHeight: 75 },
  addButton: { minHeight: 39, backgroundColor: C.darkBlue, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5, marginTop: 'auto' },
  addButtonPressed: { backgroundColor: C.mediumBlue },
  addButtonText: { color: C.white, fontSize: 10, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingHorizontal: 20, paddingVertical: 45, backgroundColor: C.white, marginTop: 6 },
  emptyTitle: { color: C.darkBlue, fontFamily: 'Georgia', fontSize: 23, fontWeight: '700' },
  emptyText: { color: C.mediumBlue, fontSize: 13, textAlign: 'center', marginTop: 8 },
  resetLink: { color: C.mediumBlue, fontSize: 13, fontWeight: '700', textDecorationLine: 'underline', marginTop: 16 },
});
