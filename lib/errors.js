// lib/errors.js
//
// Mongoose duplicate-key errors (e.g. two categories with the same slug)
// come through as a cryptic message like:
//   "E11000 duplicate key error collection: ... index: slug_1 dup key: ..."
// This turns that into something an admin can actually understand.

export function friendlyDbError(err) {
  if (err.code === 11000) {
    return "এই নামে আরেকটি আইটেম আগেই আছে। একটু আলাদা নাম দিয়ে চেষ্টা করুন।";
  }
  return err.message;
}
