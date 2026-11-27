# Overview

Casa Talavera is a cross-platform mobile app for exploring hand-painted Talavera ceramics from Puebla, Mexico. Browse the catalog, search for products, filter by category, and open a product to see its details. The app gets its product information from an Express API, which reads the shared product catalog from Cloud Firestore.

I created Casa Talavera to build my skills as a software engineer by learning how to make a mobile experience with React Native, connect it to a server API, and display live product data from Firestore. I also wanted to make the Casa Talavera catalog easier to explore on a phone.

**Software Demo Video:** Add the public or unlisted YouTube link here after recording the 4–5 minute app demo and code walkthrough.

# Development Environment

I developed the app on macOS using Visual Studio Code, the terminal, Node.js, npm, Expo, and Expo Go. The project uses Expo Router for screen navigation. The Express server runs separately from the mobile app and connects to Firebase using the Firebase Admin SDK. The mobile app calls the server over HTTP; Firebase service-account credentials stay on the server and are not included in the app.

The mobile app is written in TypeScript with React Native and Expo. It uses Expo Router for the Home, Shop, and product detail screens, Expo Image to display product photos, and React Native components for search, category filters, and buttons. Express provides the product API, and Cloud Firestore stores the catalog shared with the website.

## Getting Started

### Prerequisites

- Node.js 22 or newer and npm
- Expo Go on an iPhone or Android phone
- The Firebase project ID and a service-account JSON key for the Express server
- Your phone and computer connected to the same Wi-Fi network

### Configure the project

1. In the project root, create `.env` from `.env.example`. Set `FIREBASE_PROJECT_ID`, `GOOGLE_APPLICATION_CREDENTIALS`, and `FIRESTORE_PRODUCTS_COLLECTION` for the existing Firebase project and product collection. Keep the service-account JSON key outside this repository. Never put it in the Expo app or commit it.
2. In `Casa-Talavera/`, create `.env` from `.env.example`. Set `EXPO_PUBLIC_API_URL` to your computer's local network address, such as `http://192.168.1.25:3000`. Use your own computer's address instead of this example.
3. Use the existing Firestore catalog. Do not run the sample seed command if the collection already contains the products you want to use.

### Run the app

In a terminal at the project root, install the server dependencies and start the API:

```sh
npm install
npm start
```

Confirm the server can access Firestore by opening `http://localhost:3000/api/health` on your computer. The response should include `"source":"firestore"`. Keep this terminal open.

In a second terminal, install the mobile dependencies and start Expo:

```sh
cd Casa-Talavera
npm install
npx expo start
```

Scan the QR code with Expo Go. If you change an environment variable, restart Expo and clear its cache with `npx expo start --clear`.

# Useful Websites

- [React Native documentation](https://reactnative.dev/docs/getting-started)
- [Expo documentation](https://docs.expo.dev/)
- [Expo Router documentation](https://docs.expo.dev/router/introduction/)
- [Firebase Admin SDK setup](https://firebase.google.com/docs/admin/setup)
- [Express documentation](https://expressjs.com/)
- [CSE 310 Mobile App module requirements and README template](https://byui-cse.github.io/cse310-course/modules/module_descriptions.html)

# Future Work

- Replace the catalog's placeholder artwork with photographs of the actual products.
- Save the shopping bag between app sessions and add a dedicated bag screen.
- Add checkout and connect it to a payment provider.
