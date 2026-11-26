const { applicationDefault, initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const seedProducts = require('./Casa-Talavera/src/data/product-seed.json');
const collectionName = process.env.FIRESTORE_PRODUCTS_COLLECTION || 'products';
const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
const useLocalSeed = process.env.USE_LOCAL_PRODUCT_SEED === 'true';

let db = null;

if (projectId) {
  initializeApp({
    credential: applicationDefault(),
    projectId,
  });
  db = getFirestore();
} else if (!useLocalSeed) {
  console.warn(
    'Firestore is not configured. Set FIREBASE_PROJECT_ID and GOOGLE_APPLICATION_CREDENTIALS, or set USE_LOCAL_PRODUCT_SEED=true for local UI work.',
  );
}

class FirestoreNotConfiguredError extends Error {
  constructor() {
    super('Firestore is not configured. Follow the Firebase setup steps in README.md.');
    this.code = 'firestore/not-configured';
  }
}

function sortProducts(products) {
  return products.sort((first, second) => {
    const firstOrder = Number.isFinite(first.sortOrder) ? first.sortOrder : Number.MAX_SAFE_INTEGER;
    const secondOrder = Number.isFinite(second.sortOrder) ? second.sortOrder : Number.MAX_SAFE_INTEGER;
    return firstOrder - secondOrder || first.name.localeCompare(second.name);
  });
}

async function listProducts() {
  if (db) {
    const snapshot = await db.collection(collectionName).get();
    return sortProducts(snapshot.docs.map((document) => ({ ...document.data(), id: document.id })));
  }
  if (useLocalSeed) return sortProducts([...seedProducts]);
  throw new FirestoreNotConfiguredError();
}

async function findProduct(id) {
  if (db) {
    const document = await db.collection(collectionName).doc(id).get();
    return document.exists ? { ...document.data(), id: document.id } : null;
  }
  if (useLocalSeed) return seedProducts.find((product) => product.id === id) ?? null;
  throw new FirestoreNotConfiguredError();
}

async function checkFirestore() {
  if (!db) return { connected: false, source: useLocalSeed ? 'local-seed' : 'unconfigured' };
  const snapshot = await db.collection(collectionName).limit(1).get();
  return { connected: true, source: 'firestore', sampleCount: snapshot.size };
}

module.exports = {
  checkFirestore,
  findProduct,
  listProducts,
};
