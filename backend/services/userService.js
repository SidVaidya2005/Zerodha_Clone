const { UserModel } = require("../model/UserModel");

async function findById(id) {
  return UserModel.findById(id);
}

async function findByGoogleId(googleId) {
  return UserModel.findOne({ googleId });
}

async function findOrCreateGoogleUser({ googleId, email, fullName, avatarUrl }) {
  const existing = await findByGoogleId(googleId);
  if (existing) return existing;

  try {
    return await UserModel.create({ googleId, email: email.toLowerCase(), fullName, avatarUrl });
  } catch (error) {
    // Concurrent first-login race: another request created the same googleId
    // between our find and create. Re-read and return the winner (idempotent).
    if (error.code === 11000) {
      const created = await findByGoogleId(googleId);
      if (created) return created;
    }
    throw error;
  }
}

module.exports = { findById, findByGoogleId, findOrCreateGoogleUser };
