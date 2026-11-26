require('dotenv').config();

const express = require('express');
const path = require('node:path');
const { checkFirestore, findProduct, listProducts } = require('./firestore-products');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'css')));

app.use('/api', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

function getErrorStatus(error) {
  return error?.code === 'firestore/not-configured' ? 503 : 500;
}

function logAndRespond(res, error, api = false) {
  console.error('Product data request failed:', error);
  const status = getErrorStatus(error);
  if (api) {
    return res.status(status).json({
      error: status === 503 ? error.message : 'The product service could not load data.',
    });
  }
  return res.status(status).send(
    status === 503
      ? 'Product data is not connected yet. Follow the Firebase setup steps in README.md.'
      : 'The product service could not load data. Please try again later.',
  );
}

app.get('/', async (_req, res) => {
  try {
    const products = await listProducts();
    res.render('shop', { products, featured: products.filter((product) => product.featured) });
  } catch (error) {
    logAndRespond(res, error);
  }
});

app.get('/cart', async (_req, res) => {
  try {
    const products = await listProducts();
    res.render('cart', { products });
  } catch (error) {
    logAndRespond(res, error);
  }
});

app.get('/api/health', async (_req, res) => {
  try {
    const database = await checkFirestore();
    const connected = database.connected;
    res.status(connected || database.source === 'local-seed' ? 200 : 503).json({
      status: connected ? 'ok' : 'degraded',
      database,
    });
  } catch (error) {
    logAndRespond(res, error, true);
  }
});

app.get('/api/products', async (_req, res) => {
  try {
    res.json(await listProducts());
  } catch (error) {
    logAndRespond(res, error, true);
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await findProduct(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (error) {
    logAndRespond(res, error, true);
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await findProduct(req.params.id);
    if (!product) return res.status(404).render('not-found', { title: 'Product not found' });
    res.render('product', { product });
  } catch (error) {
    logAndRespond(res, error);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Casa Talavera is running at http://localhost:${PORT}`);
});
