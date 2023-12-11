require('dotenv').config();

const createError = require('http-errors');
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
  return jwt.verify(token, SECRET, (error, decoded) => {
    if (error) return;
    return decoded.username;
  });
};

const checkAuth = (identity) => {
  return (req, res, next) => {
    const username = checkToken(req) || '';
    if (!username) {
      return next(createError(400, 'Missing token'));
    }

    User.findOne({
      where: {
        username,
      },
    })
      .then((user) => {
        if (!user) {
          return next(createError(400, 'User not found'));
        }

        req.user = user.dataValues;
        switch (identity) {
          case 'isAdmin':
            if (!(req.user.role === 'admin')) {
              return next(createError(400, 'Permission denied'));
            }

            next();
            break;
          case 'isCreator':
            if (!(req.user.role === 'creator')) {
              console.log('hello');
              return next(createError(400, 'Permission denied'));
            }

            next();
            break;
          default:
            next();
        }
      })
      .catch((error) => {
        return next(createError(500, error));
      });
  };
};

module.exports = {
  checkAuth,
  setToken,
};
