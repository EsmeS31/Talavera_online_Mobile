# Overview

Casa Talavera Online is a web app for browsing hand-painted ceramic products inspired by Talavera pottery from Puebla, Mexico. Visitors can search and filter products, view product details, add pieces to a shopping bag, change quantities, and apply discount codes.

To start the local test server, open a terminal in this project folder and run:

```sh
npm install
npm start
```

Then open **http://localhost:3000** in a web browser to see the shop. The start command compiles the TypeScript and launches the Express server. Press `Ctrl+C` in the terminal to stop it.

My purpose for building this software is to grow my skills as a software engineer by learning how a server-side framework handles requests and uses data to generate web pages. I also want to learn how browser interactions and saved cart data can make an online shop useful to customers and a small business.

[Software Demo Video](https://youtu.be/_krr-XDNRwM)

# Web Pages

- **Shop (`/`)** — The Express server passes product and featured-product data to an EJS template, which generates the catalog. Visitors can search by product name, filter by category, browse featured pieces with the carousel, and add products to their bag. The contact form validates the required fields and displays a confirmation message.
- **Shopping bag (`/cart`)** — Express renders the cart page. TypeScript reads saved cart items from browser local storage and displays products with quantity controls. Subtotal, discount, estimated shipping, and total update when the cart changes. The cart and selected discount code persist after a page refresh.
- **Product details (`/products/:id`)** — Selecting a product name opens a page rendered with that product's server-side data, including its category, description, price, and image placeholder. Visitors can add it to their bag or return to the shop. An unknown product ID displays a not-found page.

The header links to shop sections and the shopping bag. Product names link from the catalog to their detail pages. The `/api/products` route returns the catalog as JSON. The three rendered pages satisfy the assignment's additional-page stretch challenge.

# Development Environment

I used a terminal, and a local Node.js server to develop and run the app. The `npm` package manager installs the project libraries and runs the build and start commands.

The app is written with JavaScript and TypeScript. Node.js runs the server, Express handles web requests, EJS renders HTML templates with product data, and the TypeScript compiler builds the browser code in `src/shop.ts` into `public/js/shop.js`. HTML and CSS define the page structure and layout. Browser local storage preserves the cart and discount code.

# Useful Websites

- [Node.js Learn](https://nodejs.org/learn)
- [Express installation and getting started](https://expressjs.com/en/starter/installing/)
- [EJS documentation](https://ejs.co/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)

# Future Work

- Connect the contact form to a service that can deliver and store messages.
- Add a database for products, inventory, and customer carts.
- Connect checkout to a payment provider and add real product photography.

## Mobile app: Express API and Firestore

The Expo app lives in `Casa-Talavera/`. Home, Shop, and product details request product data from the Express API. Express reads the `products` collection in Cloud Firestore using the Firebase Admin SDK. Firebase credentials stay on the server and must never be added to the Expo app.

### 1. Create and configure Firestore

1. Create a Firebase project and a Cloud Firestore database in the Firebase console.
2. Create a server service account with permission to access that database and download its JSON key. Keep the key outside this project folder; do not commit it or copy its contents into the app.
3. Copy the example environment file at the project root:

   ```sh
   cp .env.example .env
   ```

4. Edit `.env` and set `FIREBASE_PROJECT_ID` to your Firebase project ID and `GOOGLE_APPLICATION_CREDENTIALS` to the **absolute path** of the service-account JSON file. Keep `FIRESTORE_PRODUCTS_COLLECTION=products`.

### 2. Seed the initial product documents

From the project root, run:

```sh
npm run seed:firestore
```

This creates or merges the six starter products into the `products` collection. Each product uses its existing slug as the Firestore document ID, such as `flor-azul` or `sol-planter`. It does not delete other documents.

The seed fields are `name`, `category`, `categoryName`, `placeholder`, `price`, `color`, `motif`, `description`, `featured`, and `sortOrder`. You can optionally add `imageUrl` later when you have product photos.

### 3. Start the Express API

From the project root:

```sh
npm start
```

The server listens on port 3000 and on the local network. Check that Firestore is connected by opening `http://localhost:3000/api/health`. A successful Firestore connection reports `"source":"firestore"`. Check the product list at `http://localhost:3000/api/products` or one item at `http://localhost:3000/api/products/flor-azul`.

For interface work before Firebase credentials are ready, set `USE_LOCAL_PRODUCT_SEED=true` in the root `.env`. In that mode the API uses the starter JSON file, and `/api/health` reports `"source":"local-seed"`; this does **not** confirm Firestore access.

### 4. Point Expo Go at the API

Copy `Casa-Talavera/.env.example` to `Casa-Talavera/.env`. Replace `YOUR_COMPUTER_LAN_IP` with your Mac’s local IPv4 address, for example `192.168.1.25`:

```text
EXPO_PUBLIC_API_URL=http://192.168.1.25:3000
```

Use the computer’s LAN IP instead of `localhost` when testing on a physical phone. Keep the phone and Mac on the same Wi-Fi. Then start Expo from the app folder:

```sh
cd Casa-Talavera
npx expo start --clear
```

The app requests `GET /api/products` for Home and Shop, and `GET /api/products/:id` for details. Search and category filters run on the products returned by the API. `EXPO_PUBLIC_API_URL` is public configuration; the Firebase service-account key belongs only in the root server `.env`.

### 5. Product details route

Selecting a product image or name in Shop opens `/products/:id`. That screen fetches the matching document through Express, shows a loading or error state while needed, and displays the item’s category, name, price, description, and photo/placeholder. A missing document shows a not-found message.
