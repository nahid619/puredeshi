// lib/cloudinary.js
//
// Configures the Cloudinary SDK using environment variables.
// Phase 3 will use this for real image uploads from the admin panel.
// Phase 1 just proves the credentials are valid (see app/api/health/route.js).

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
