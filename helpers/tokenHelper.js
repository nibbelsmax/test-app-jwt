const jwt = require('jsonwebtoken'),
  uuid = require('uuid').v4,
  bcrypt = require('bcrypt');

const Token = require('../models/token');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  getAccessToken: (guid) => {
    const options = {
      algorithm: 'HS512',
      expiresIn: '2h',
    };
    const payload = {
      type: 'access',
      guid,
    };
    return jwt.sign(payload, JWT_SECRET, options);
  },

  getRefreshToken: (guid) => {
    const options = {
      expiresIn: '60d',
    };
    const payload = {
      type: 'refresh',
      id: uuid(),
      guid,
    };
    return jwt.sign(payload, JWT_SECRET, options);
  },

  replaceRefreshToken: async (token, guid) => {
    await Token.findOneAndRemove({ guid }).exec();
    const hash = await bcrypt.hash(token, 3);
    await Token.create({
      guid,
      token: hash,
    });
  },
};
