import { Link } from 'expo-router';
import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
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

function Eyebrow({ children }: { children: string }) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

function productArtColor(product: Product) {
  if (product.color === 'sun-flower') return C.mediumBlue;
  if (product.color === 'red-flower') return C.darkBlue;
  return C.deepBlue;
}

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

export default function HomeScreen() {
  const { products, isLoading, error, retry } = useProducts();
  const featured = products.filter((product) => product.featured);
  const collectionProducts = products.slice(0, 4);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}><Text style={styles.logoMark}>✦ </Text>Casa <Text style={styles.logoItalic}>Talavera</Text></Text>
          <Link href="/explore" style={styles.bagLink}>Bag (0)</Link>
        </View>

        <View style={styles.hero}>
          <Eyebrow>Hand-painted in Puebla, Mexico</Eyebrow>
          <Text style={styles.heroTitle}>Made by hand.{ '\n' }<Text style={styles.heroItalic}>Meant for home.</Text></Text>
          <Text style={styles.heroCopy}>Colorful Talavera ceramics that carry centuries of artistry from our family to yours.</Text>
          <Link href="/explore" style={styles.primaryButton}>Explore the collection  →</Link>
        </View>

        <View style={styles.intro}>
          <Eyebrow>What is Talavera?</Eyebrow>
          <Text style={styles.sectionTitle}>From clay to color, made slowly.</Text>
          <Text style={styles.body}>Talavera is a traditional tin-glazed ceramic art form born in Puebla, Mexico. Each piece is shaped, painted, and finished by hand—so no two are ever exactly alike.</Text>
          <Text style={styles.textLink}>Learn more  →</Text>
        </View>

        <View style={styles.featuredSection}>
          <Eyebrow>Featured collection</Eyebrow>
          <Text style={styles.sectionTitle}>Small details, bright moments.</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredRail}>
            {isLoading && <Text style={styles.body}>Loading featured pieces…</Text>}
            {error && <View style={styles.loadError}><Text style={styles.body}>{error}</Text><Pressable onPress={retry}><Text style={styles.textLink}>Try again</Text></Pressable></View>}
            {featured.map((item) => (
              <View key={item.name} style={styles.featuredCard}>
                <View style={[styles.featuredArt, { backgroundColor: productArtColor(item) }]}>
                  {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.productPhoto} contentFit="cover" /> : <View style={styles.plateRing}><Text style={styles.plateMotif}>{item.motif}</Text></View>}
                  <Text style={styles.artLabel}>TALAVERA PLATE</Text>
                </View>
                <View style={styles.featuredCopy}>
                  <Eyebrow>Featured piece</Eyebrow>
                  <Text style={styles.featuredName}>{item.name}</Text>
                  <Text style={styles.body}>{item.description}</Text>
                  <Text style={styles.price}>{formatPrice(item.price)}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <Text style={styles.carouselHint}>Swipe to see more pieces  →</Text>
        </View>

        <View style={styles.collection}>
          <Eyebrow>Shop Talavera</Eyebrow>
          <Text style={styles.sectionTitle}>Bring color to the everyday.</Text>
          <Link href="/explore" style={styles.textLink}>View all pieces  →</Link>
          {isLoading && <Text style={styles.body}>Loading the collection…</Text>}
          {error && <View style={styles.loadError}><Text style={styles.body}>{error}</Text><Pressable onPress={retry}><Text style={styles.textLink}>Try again</Text></Pressable></View>}
          <View style={styles.productGrid}>
            {collectionProducts.map((item) => (
              <View key={item.id} style={styles.productCard}>
                <View style={[styles.productArt, { borderColor: productArtColor(item) }]}>
                  {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.productPhoto} contentFit="cover" /> : <Text style={[styles.productMotif, { color: productArtColor(item) }]}>{item.motif}</Text>}
                </View>
                <Text style={styles.productCategory}>{item.categoryName.toUpperCase()}</Text>
                <View style={styles.productLine}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.price}>{formatPrice(item.price)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.story}>
          <View style={styles.storyVideoFrame}>
            <WebView
              source={{ uri: 'https://player.vimeo.com/video/136252920?h=850b72e30e' }}
              style={styles.storyVideo}
              allowsFullscreenVideo
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction
              javaScriptEnabled
              domStorageEnabled
            />
          </View>
          <Eyebrow>A labor of love</Eyebrow>
          <Text style={styles.sectionTitle}>Every piece tells a colorful story.</Text>
          <Text style={styles.body}>Talavera Azul began in Puebla, Mexico. Founded by Saúl Sánchez, whose passion for his culture inspired him to share the beauty and tradition of Talavera pottery with others.</Text>
          <Text style={styles.textLink}>Meet our story  →</Text>
        </View>

        <View style={styles.contact}>
          <Eyebrow>Contact us</Eyebrow>
          <Text style={styles.contactTitle}>Let’s talk Talavera.</Text>
          <Text style={styles.contactCopy}>Send us a message with your questions.</Text>
          <Link href="/explore" style={styles.contactButton}>Get in touch  →</Link>
        </View>
        <Text style={styles.footer}>CASA TALAVERA  ·  HECHO A MANO EN PUEBLA, MÉXICO</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.white },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingBottom: 30 },
  header: { minHeight: 64, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: C.lightBlue, backgroundColor: C.white },
  logo: { color: C.darkBlue, fontFamily: 'Georgia', fontSize: 20, fontWeight: '700' },
  logoMark: { color: C.deepBlue },
  logoItalic: { color: C.mediumBlue, fontStyle: 'italic' },
  bagLink: { color: C.darkBlue, fontWeight: '700', fontSize: 13 },
  hero: { paddingHorizontal: 25, paddingTop: 61, paddingBottom: 66, backgroundColor: C.white, alignItems: 'flex-start' },
  eyebrow: { color: C.mediumBlue, fontSize: 10, fontWeight: '800', letterSpacing: 1.8, textTransform: 'uppercase' },
  heroTitle: { color: C.darkBlue, fontFamily: 'Georgia', fontWeight: '700', fontSize: 43, lineHeight: 49, marginTop: 18, letterSpacing: -1.5 },
  heroItalic: { fontStyle: 'italic' },
  heroCopy: { color: C.darkBlue, fontSize: 15, lineHeight: 24, marginTop: 16, maxWidth: 420 },
  primaryButton: { backgroundColor: C.darkBlue, color: C.white, fontWeight: '700', fontSize: 13, paddingHorizontal: 18, paddingVertical: 14, marginTop: 22 },
  intro: { paddingHorizontal: 25, paddingTop: 34, paddingBottom: 37, borderTopWidth: 1, borderTopColor: C.lightBlue, backgroundColor: C.white },
  sectionTitle: { color: C.darkBlue, fontFamily: 'Georgia', fontSize: 29, lineHeight: 35, fontWeight: '700', marginTop: 10 },
  body: { color: C.darkBlue, fontSize: 14, lineHeight: 22, marginTop: 12 },
  textLink: { color: C.mediumBlue, fontSize: 13, fontWeight: '700', marginTop: 15 },
  featuredSection: { backgroundColor: C.white, paddingTop: 35, paddingBottom: 37 },
  featuredRail: { paddingHorizontal: 20, paddingTop: 21, paddingBottom: 6, gap: 14 },
  featuredCard: { width: 320, flexDirection: 'row', backgroundColor: C.lightBlue, minHeight: 220 },
  featuredArt: { width: '43%', alignItems: 'center', justifyContent: 'center', padding: 12 },
  productPhoto: { width: '100%', height: '100%' },
  loadError: { paddingHorizontal: 20, paddingVertical: 14, backgroundColor: C.lightBlue },
  plateRing: { width: 94, height: 94, borderRadius: 47, backgroundColor: C.white, borderWidth: 5, borderColor: '#B8C1D5', alignItems: 'center', justifyContent: 'center' },
  plateMotif: { color: C.deepBlue, fontSize: 47 },
  artLabel: { color: C.white, fontFamily: 'Georgia', fontSize: 10, marginTop: 10 },
  featuredCopy: { flex: 1, justifyContent: 'center', padding: 15 },
  featuredName: { color: C.darkBlue, fontSize: 17, fontWeight: '700', marginTop: 12 },
  price: { color: C.mediumBlue, fontSize: 14, fontWeight: '700', marginTop: 10 },
  carouselHint: { color: C.mediumBlue, fontSize: 12, textAlign: 'center', marginTop: 12 },
  collection: { backgroundColor: C.lightBlue, paddingHorizontal: 22, paddingTop: 36, paddingBottom: 38 },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20, rowGap: 20 },
  productCard: { width: '48%' },
  productArt: { height: 154, backgroundColor: C.white, borderWidth: 8, alignItems: 'center', justifyContent: 'center' },
  productMotif: { fontSize: 62 },
  productCategory: { color: C.mediumBlue, fontSize: 9, fontWeight: '800', letterSpacing: 1, marginTop: 10 },
  productLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4, marginTop: 4 },
  productName: { color: C.darkBlue, fontSize: 12, fontWeight: '700', flex: 1 },
  story: { backgroundColor: C.white, paddingHorizontal: 25, paddingTop: 38, paddingBottom: 40 },
  storyVideoFrame: { width: '100%', aspectRatio: 16 / 9, backgroundColor: C.lightBlue, borderWidth: 8, borderColor: '#D5D9E4', marginBottom: 27, overflow: 'hidden' },
  storyVideo: { flex: 1, backgroundColor: C.lightBlue },
  contact: { backgroundColor: C.deepBlue, paddingHorizontal: 25, paddingVertical: 35 },
  contactTitle: { color: C.white, fontFamily: 'Georgia', fontWeight: '700', fontSize: 30, marginTop: 10 },
  contactCopy: { color: C.white, fontSize: 14, marginTop: 8 },
  contactButton: { alignSelf: 'flex-start', color: C.white, fontSize: 13, fontWeight: '700', borderWidth: 1, borderColor: C.white, paddingHorizontal: 15, paddingVertical: 12, marginTop: 18 },
  footer: { color: C.mediumBlue, fontSize: 8, fontWeight: '700', letterSpacing: 1, textAlign: 'center', paddingHorizontal: 18, paddingTop: 20 },
});
