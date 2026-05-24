const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 10;
const TOKEN_TTL = "7d";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return secret;
}

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function signToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: TOKEN_TTL });
}

function verifyToken(token) {
  return jwt.verify(token, getSecret());
}

module.exports = { hashPassword, verifyPassword, signToken, verifyToken };
