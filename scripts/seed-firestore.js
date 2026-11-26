require('dotenv').config();

const { applicationDefault, initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const products = require('../Casa-Talavera/src/data/product-seed.json');

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
const collectionName = process.env.FIRESTORE_PRODUCTS_COLLECTION || 'products';

async function seedFirestore() {
  if (!projectId) {
    throw new Error('Set FIREBASE_PROJECT_ID in the project-root .env file first.');
  }

  initializeApp({ credential: applicationDefault(), projectId });
  const db = getFirestore();
  const batch = db.batch();

  for (const product of products) {
    const { id, ...fields } = product;
    batch.set(db.collection(collectionName).doc(id), fields, { merge: true });
  }

  await batch.commit();
  console.log(`Seeded ${products.length} products into Firestore collection "${collectionName}".`);
}

seedFirestore().catch((error) => {
  console.error('Could not seed Firestore:', error.message);
  process.exitCode = 1;
});
