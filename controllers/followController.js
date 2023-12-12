const createError = require('http-errors');
const db = require('../models');
const { Follow, User } = db;

const followController = {
  createFollowing: (req, res, next) => {
    const followerId = req.user.id;
    const followingId = Number(req.body.id);

    if (followerId === followingId) {
      return next(createError(400, 'Can not follow yourself'));
    }

    User.findByPk(followingId)
      .then((user) => {
        if (!user) {
          return next(createError(401, 'User not found'));
        }

        Follow.findOrCreate({
          where: {
            followerId,
            followingId,
          },
        })
          .then((follow) => {
            if (!follow[1]) {
              return next(createError(401, 'Has been follow the user'));
            }

            return res.status(200).json({
              ok: 1,
              message: 'Follow the user success',
            });
          })
          .catch((error) => {
            return next(createError(500, error));
          });
      })
      .catch((error) => {
        return next(createError(500, error));
      });
  },

  deleteFollowing: (req, res, next) => {
    const followerId = req.user.id;
    const followingId = Number(req.params.id);

    User.findByPk(followingId)
      .then((user) => {
        if (!user) {
          return next(createError(401, 'User not found'));
        }

        Follow.findOne({
          where: {
            followerId,
            followingId,
          },
        })
          .then((follow) => {
            if (!follow) {
              return next(createError(400, 'Never followed the user'));
            }

            follow
              .destroy()
              .then(() => {
                return res.status(200).json({
                  ok: 1,
                  message: 'Unfollow the user success',
                });
              })
              .catch((error) => {
                return next(createError(500, error));
              });
          })
          .catch((error) => {
            return next(createError(500, error));
          });
      })
      .catch((error) => {
        return next(createError(500, error));
      });
  },
};

module.exports = followController;
