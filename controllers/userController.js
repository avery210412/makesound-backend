const createError = require('http-errors');
const bcrypt = require('bcrypt');
const db = require('../models');
const { setToken } = require('../middlewares/auth');
const SALTROUNDS = 10;
const { User } = db;

const userController = {
  // handle register
  register: (req, res, next) => {
    const { fullname, username, nickname, password } = req.body;
    if (!fullname.trim() || !username.trim() || !nickname.trim() || !password.trim()) {
      return next(createError(400, 'Fullname, username, nickname and password are required'));
    }

    User.findOne({
      where: {
        username,
      },
    })
      .then((user) => {
        if (user) {
          return next(createError(400, 'User exists, please login or change username'));
        }

        bcrypt.hash(password, SALTROUNDS, (error, hash) => {
          if (error) {
            return next(createError(500, error));
          }

          User.create({
            userId: Math.floor(Date.now() / 1000),
            fullname,
            username,
            nickname,
            password: hash,
          })
            .then(() => {
              const token = setToken(username);
              return res.status(200).json({
                ok: 1,
                message: 'Register success',
                token,
              });
            })
            .catch((error) => {
              return next(createError(500, error));
            });
        });
      })
      .catch((error) => {
        return next(createError(500, error));
      });
  },

  // handle login
  login: (req, res, next) => {
    const { username, password } = req.body;
    if (!username.trim() || !password.trim()) {
      return next(createError(400, 'Username and password are required'));
    }

    User.findOne({
      where: {
        username,
      },
    })
      .then((user) => {
        if (!user) {
          return next(createError(401, 'User not found'));
        }

        bcrypt.compare(password, user.password, (error, isSuccess) => {
          if (error || !isSuccess) {
            return next(createError(400, 'Password is invalid'));
          }

          const token = setToken(username);
          return res.status(200).json({
            ok: 1,
            message: 'Login success',
            token,
          });
        });
      })
      .catch((error) => {
        return next(createError(500, error));
      });
  },

  // handle logout
  logout: (req, res) => {
    return res.status(200).json({
      ok: 1,
      message: 'Hope to see you soon',
    });
  },

  // use token to get personal information
  getOwnInfo: (req, res, next) => {
    User.findByPk(req.user.id)
      .then((user) => {
        if (!user) {
          return next(createError(401, 'User not found'));
        }

        const { userId, fullname, username, nickname, avatar, location, gender, birth, introduce, role } = user;
        const result = {
          userId,
          fullname,
          username,
          nickname,
          avatar,
          location,
          gender,
          birth,
          introduce,
          role,
        };
        return res.status(200).json({
          ok: 1,
          data: result,
        });
      })
      .catch((error) => {
        return next(createError(500, error));
      });
  },

  // let user update personal information
  updateOwnInfo: (req, res, next) => {
    const { nickname, avatar, location, gender, birth, introduce } = req.body;

    User.findByPk(req.user.id)
      .then((user) => {
        if (!user) {
          return next(createError(401, 'User not found'));
        }

        User.update(
          {
            nickname,
            avatar,
            location,
            gender,
            birth,
            introduce,
          },
          {
            where: {
              id: user.id,
            },
          }
        )
          .then(() => {
            return res.status(200).json({
              ok: 1,
              message: 'User update personal information success',
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

  // let user modify password
  updateOwnPassword: (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      return next(createError(400, 'Fields are all required'));
    }

    User.findByPk(req.user.id)
      .then((user) => {
        if (!user) {
          return next(createError(401, 'User not found'));
        }

        bcrypt.compare(oldPassword, user.password, (error, isSuccess) => {
          if (error || !isSuccess) return next(createError(400, 'Invalid old password'));

          if (oldPassword === newPassword) return next(createError(400, 'Old password and new password cannot be same'));

          if (newPassword !== confirmPassword) return next(createError(400, 'New password and confirm password should be equal'));

          bcrypt.hash(newPassword, SALTROUNDS, (error, hash) => {
            if (error) {
              return next(createError(500, error));
            }

            User.update(
              { password: hash },
              {
                where: {
                  id: user.id,
                },
              }
            )
              .then(() => {
                return res.status(200).json({
                  ok: 1,
                  message: 'User update password success',
                });
              })
              .catch((error) => {
                return next(createError(500, error));
              });
          });
        });
      })
      .catch((error) => {
        return next(createError(500, error));
      });
  },

  // let user delete own account
  deleteOwnAccount: (req, res, next) => {
    User.findByPk(req.user.id)
      .then((user) => {
        if (!user) {
          return next(createError(401, 'User not found'));
        }

        User.destroy({
          where: {
            id: user.id,
          },
        })
          .then(() => {
            return res.status(200).json({
              ok: 1,
              message: 'User has been deleted own account',
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

  /*
  applyForCreator: (req, res, next) => {},
  */
};

module.exports = userController;
