const User = require("./db");
const bcrypt = require("bcrypt");

async function createUser(name, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, password: hashedPassword });
  return await newUser.save();
}

async function findUserByName(name) {
  return await User.findOne({ name });
}

module.exports = {
  createUser,
  findUserByName,
};
