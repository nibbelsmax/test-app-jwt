const jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt');

const Token = require('../models/token');

const {
  getAccessToken,
  getRefreshToken,
  replaceRefreshToken,
} = require('../helpers/tokenHelper');

const JWT_SECRET = process.env.JWT_SECRET;

async function updateTokens(guid) {
  const accessToken = getAccessToken(guid);
  const refreshToken = getRefreshToken(guid);

  await replaceRefreshToken(refreshToken, guid);

  return {
    accessToken,
    refreshToken,
  };
}

async function refreshTokens(req, res) {
  const { refreshToken } = req.body;
  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET);
    if (payload.type !== 'refresh') {
      res.status(400).json({
        error: 'Invalid token type',
      });
    }
    const userToken = await Token.findOne({ guid: payload.guid }).exec();

    if (userToken === null) {
      throw new Error('Invalid token');
    } else {
      if (await bcrypt.compare(refreshToken, userToken.token)) {
        const { accessToken, refreshToken } = await updateTokens(
          userToken.guid
        );
        res.json({
          accessToken,
          refreshToken,
        });
      } else {
        res.status(400).json({
          err: 'Invalid user refresh token',
        });
      }
    }
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      res.status(400).json({
        error: 'Token expired',
      });
    } else if (e instanceof jwt.JsonWebTokenError) {
      res.status(400).json({
        error: 'Invalid token',
      });
    }
  }
}

module.exports = {
  updateTokens,
  refreshTokens,
};
