require('dotenv').config();

const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_KEY || 'test_key';
const db = require('../models');
const { User } = db;

const setToken = (username) => {
  const payload = {
    username,
  };
  const expiresIn = Math.floor(Date.now() / 1000) + 86400 * 30;
  return jwt.sign(payload, SECRET, { expiresIn });
};

const checkToken = (req) => {
  if (!req.header('Authorization')) return;
  const token = req.header('Authorization').replace('Bearer ', '');
  return jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return;
    return decoded.username;
  });
};

const checkAuth = (identity) => {
  return (req, res, next) => {
    const username = checkToken(req) || '';
    if (!username) return res.status(400).json({ ok: 0, message: 'missing token' });
    User.findOne({
      where: {
        username,
      },
    })
      .then((user) => {
        if (!user) return res.status(400).json({ ok: 0, message: 'User not found' });
        req.user = user.dataValues;

        switch (identity) {
          case 'isAdmin':
            if (!req.user.role === 'admin') return res.status(400).json({ ok: 0, message: 'permission denied' });
            next();
            break;
          case 'isCreator':
            if (!req.user.role === 'creator') return res.status(400).json({ ok: 0, message: 'permission denied' });
            next();
            break;
          default:
            next();
        }
      })
      .catch((err) => res.status(500).json({ ok: 0, data: err }));
  };
};

module.exports = {
  checkAuth,
  setToken,
};
