const { model } = require("mongoose");

const { UserSchema } = require("../schemas/UserSchema");

const UserModel = new model("user", UserSchema);

module.exports = { UserModel };
