const { UserModel } = require("../model/UserModel");

async function findByEmail(email) {
  return UserModel.findOne({ email: email.toLowerCase() });
}

async function findById(id) {
  return UserModel.findById(id);
}

async function createUser({ fullName, email, phoneNumber, passwordHash }) {
  return UserModel.create({ fullName, email, phoneNumber, passwordHash });
}

module.exports = { findByEmail, findById, createUser };
