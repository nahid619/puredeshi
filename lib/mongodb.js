// lib/mongodb.js
//
// Reusable MongoDB connection helper using Mongoose.
// Caches the connection across requests so we don't open a new connection
// every time a serverless function runs (important on Vercel).
//
// Phase 2 will add the actual schemas (Product, Category, etc.) that use
// this connection. Phase 1 just proves the connection itself works.

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Cache the connection on the global object in development so hot-reload
// doesn't create a new connection on every file save.
let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Copy .env.example to .env.local and fill in your MongoDB Atlas connection string."
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 8000, // fail fast instead of the 30s default
      })
      .then((mongooseInstance) => mongooseInstance)
      .catch((err) => {
        // Don't cache a failed attempt forever — clear it so the *next*
        // request tries again (important if the URI was just fixed, or a
        // transient network blip caused the first attempt to fail).
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
