// giftlink-backend/models/user.js
// Placeholder user model — fully implemented in Module 4.

/**
 * Shape of a GiftLink user document:
 * {
 *   _id:        ObjectId,
 *   firstName:  String,
 *   lastName:   String,
 *   email:      String (unique),
 *   username:   String (unique),
 *   password:   String (hashed),
 *   createdAt:  Date,
 *   updatedAt:  Date
 * }
 */
module.exports = {
  collectionName: 'users',
};