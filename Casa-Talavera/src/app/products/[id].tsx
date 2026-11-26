import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { Link, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Product } from '@/data/products';
import { fetchProduct } from '@/services/products';

const C = {
  white: '#FEFEFE',
  lightBlue: '#E7E9F0',
  darkBlue: '#051747',
  mediumBlue: '#535F80',
  deepBlue: '#081F62',
};

function artColor(product: Product) {
  if (product.color === 'sun-flower') return C.mediumBlue;
  if (product.color === 'red-flower') return C.darkBlue;
  return C.deepBlue;
}

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const productId = id;
    if (!productId) return;

    let isCurrentRequest = true;

    async function loadProduct(requestedId: string) {
      setIsLoading(true);
      setError(null);
      setProduct(null);
      try {
        const result = await fetchProduct(requestedId);
        if (isCurrentRequest) setProduct(result);
      } catch (cause) {
        if (isCurrentRequest) {
          setError(cause instanceof Error ? cause.message : 'Could not load this product.');
        }
      } finally {
        if (isCurrentRequest) setIsLoading(false);
      }
    }

    void loadProduct(productId);

    return () => {
      isCurrentRequest = false;
    };
  }, [id, reloadKey]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}><Text style={styles.logoMark}>✦ </Text>Casa <Text style={styles.logoItalic}>Talavera</Text></Text>
        </View>

        <Link href="/explore" style={styles.breadcrumb}>← Back to the collection</Link>

        {!id && (
          <View style={styles.messageCard}>
            <Text style={styles.errorTitle}>Product link is incomplete.</Text>
            <Text style={styles.body}>Return to the collection and choose a product.</Text>
          </View>
        )}
        {Boolean(id) && isLoading && <Text style={styles.message}>Loading product details…</Text>}
        {error && (
          <View style={styles.messageCard}>
            <Text style={styles.errorTitle}>Product unavailable</Text>
            <Text style={styles.body}>{error}</Text>
            <Pressable onPress={() => setReloadKey((current) => current + 1)}>
              <Text style={styles.retry}>Try again</Text>
            </Pressable>
          </View>
        )}
        {!isLoading && !error && !product && (
          <View style={styles.messageCard}>
            <Text style={styles.errorTitle}>We couldn’t find that piece.</Text>
            <Text style={styles.body}>It may have been removed from the catalog.</Text>
          </View>
        )}
        {product && (
          <View style={styles.product}>
            <View style={[styles.artwork, { borderColor: artColor(product) }]}>
              {product.imageUrl ? (
                <Image source={{ uri: product.imageUrl }} style={styles.photo} contentFit="cover" />
              ) : (
                <View style={[styles.artworkInner, product.color === 'sun-flower' && styles.sunArt]}>
                  <Text style={[styles.motif, { color: artColor(product) }]}>{product.motif}</Text>
                  <Text style={styles.placeholder}>{product.placeholder}</Text>
                </View>
              )}
            </View>
            <Text style={styles.eyebrow}>{product.categoryName}</Text>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            <Text style={styles.body}>{product.description}</Text>
            <Text style={styles.note}>Each piece is hand-painted in Puebla, Mexico. Small variations are part of its handmade character.</Text>
            <Link href="/explore" style={styles.continueButton}>Continue browsing</Link>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.white },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingBottom: 38 },
  header: { minHeight: 64, paddingHorizontal: 22, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: C.lightBlue },
  logo: { color: C.darkBlue, fontFamily: 'Georgia', fontSize: 20, fontWeight: '700' },
  logoMark: { color: C.deepBlue },
  logoItalic: { color: C.mediumBlue, fontStyle: 'italic' },
  breadcrumb: { color: C.mediumBlue, fontSize: 13, fontWeight: '700', marginHorizontal: 22, marginTop: 22 },
  product: { paddingHorizontal: 22, paddingTop: 18 },
  artwork: { width: '100%', aspectRatio: 0.95, borderWidth: 10, backgroundColor: C.white, padding: 6, marginBottom: 25 },
  artworkInner: { flex: 1, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  sunArt: { backgroundColor: C.lightBlue },
  photo: { width: '100%', height: '100%' },
  motif: { fontSize: 106 },
  placeholder: { position: 'absolute', bottom: 12, color: C.mediumBlue, backgroundColor: C.white, paddingHorizontal: 7, fontSize: 12 },
  eyebrow: { color: C.mediumBlue, fontSize: 11, fontWeight: '800', letterSpacing: 1.8, textTransform: 'uppercase' },
  title: { color: C.darkBlue, fontFamily: 'Georgia', fontSize: 37, lineHeight: 43, fontWeight: '700', marginTop: 8 },
  price: { color: C.mediumBlue, fontSize: 18, fontWeight: '700', marginTop: 15 },
  body: { color: C.darkBlue, fontSize: 15, lineHeight: 23, marginTop: 13 },
  note: { color: C.mediumBlue, fontSize: 13, lineHeight: 20, marginTop: 15 },
  continueButton: { alignSelf: 'flex-start', color: C.white, backgroundColor: C.darkBlue, fontSize: 13, fontWeight: '700', paddingVertical: 14, paddingHorizontal: 18, marginTop: 24 },
  message: { color: C.mediumBlue, padding: 24, fontSize: 14 },
  messageCard: { margin: 22, padding: 24, backgroundColor: C.lightBlue },
  errorTitle: { color: C.darkBlue, fontFamily: 'Georgia', fontSize: 23, fontWeight: '700' },
  retry: { color: C.deepBlue, fontSize: 13, fontWeight: '700', textDecorationLine: 'underline', marginTop: 16 },
});
