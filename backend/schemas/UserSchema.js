const { Schema } = require("mongoose");

const UserSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    googleId: { type: String, required: true, unique: true },
    avatarUrl: { type: String, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = { UserSchema };
