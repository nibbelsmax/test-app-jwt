const express = require('express'),
  router = express.Router(),
  { updateTokens, refreshTokens } = require('../controllers/tokenController');

router.route('/access/:guid').get(async (req, res) => {
  const tokens = await updateTokens(req.params.guid);
  res.json(tokens);
});

router.route('/refresh').post(refreshTokens);

module.exports = router;
