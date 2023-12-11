const createError = require('http-errors');
const { Op } = require('sequelize');
const fs = require('fs').promises;
const path = require('path');
const db = require('../models');
const { Song, User } = db;

const songController = {
  // get all songs
  getSongs: (req, res, next) => {
    Song.findAndCountAll({
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'nickname', 'avatar'],
        },
      ],
      attributes: {
        exclude: ['info', 'lyrics', 'createdAt', 'updatedAt'],
      },
    })
      .then((songs) => {
        return res.status(200).json({
          ok: 1,
          count: songs.count,
          songs: songs.rows,
        });
      })
      .catch((error) => {
        return next(createError(500, error));
      });
  },

  // get hot songs
  getHotSongs: (req, res, next) => {
    Song.findAndCountAll({
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'nickname', 'avatar'],
        },
      ],
      order: [['playCount', 'DESC']],
      attributes: {
        exclude: ['info', 'lyrics', 'createdAt', 'updatedAt'],
      },
    })
      .then((songs) => {
        return res.status(200).json({
          ok: 1,
          count: songs.count,
          songs: songs.rows,
        });
      })
      .catch((error) => {
        return next(createError(500, error));
      });
  },

  // get hot songs by genre
  getHotSongsByGenre: (req, res, next) => {
    const { genre } = req.params;

    Song.findAndCountAll({
      where: {
        genre,
      },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'nickname', 'avatar'],
        },
      ],
      order: [['playCount', 'DESC']],
      attributes: {
        exclude: ['info', 'lyrics', 'createdAt', 'updatedAt'],
      },
    })
      .then((songs) => {
        return res.status(200).json({
          ok: 1,
          count: songs.count,
          songs: songs.rows,
        });
      })
      .catch((error) => {
        return next(createError(500, error));
      });
  },

  // get latest songs
  getLatestSongs: (req, res, next) => {
    Song.findAndCountAll({
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'nickname', 'avatar'],
        },
      ],
      order: [['createdAt', 'DESC']],
      attributes: {
        exclude: ['info', 'lyrics', 'createdAt', 'updatedAt'],
      },
    })
      .then((songs) => {
        return res.status(200).json({
          ok: 1,
          count: songs.count,
          songs: songs.rows,
        });
      })
      .catch((error) => {
        return next(createError(500, error));
      });
  },

  // get latest songs by genre
  getLatestSongsByGenre: (req, res, next) => {
    const { genre } = req.params;

    Song.findAndCountAll({
      where: {
        genre,
      },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'nickname', 'avatar'],
        },
      ],
      order: [['createdAt', 'DESC']],
      attributes: {
        exclude: ['info', 'lyrics', 'createdAt', 'updatedAt'],
      },
    })
      .then((songs) => {
        return res.status(200).json({
          ok: 1,
          count: songs.count,
          songs: songs.rows,
        });
      })
      .catch((error) => {
        return next(createError(500, error));
      });
  },

  // search a song
  searchSong: (req, res, next) => {
    const { keyword } = req.query;
    if (!keyword) {
      return next(createError(400, 'Keyword is required'));
    }

    Song.findAndCountAll({
      where: {
        title: {
          [Op.like]: `%${keyword}%`,
        },
      },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'nickname', 'avatar'],
        },
      ],
      order: [['playCount', 'DESC']],
      attributes: {
        exclude: ['info', 'lyrics', 'createdAt', 'updatedAt'],
      },
    })
      .then((songs) => {
        if (songs.count === 0) {
          return next(createError(401, 'Can not find anything'));
        }

        return res.status(200).json({
          ok: 1,
          count: songs.count,
          songs: songs.rows,
        });
      })
      .catch((error) => {
        return next(createError(500, error));
      });
  },

  // get information of the song
  getSong: (req, res, next) => {
    const { id } = req.params;

    Song.findOne({
      where: {
        songId: id,
      },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'nickname', 'avatar', 'role'],
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    })
      .then((song) => {
        if (!song) {
          return next(createError(401, 'Song not found'));
        }

        return res.status(200).json({
          ok: 1,
          song,
        });
      })
      .catch((error) => {
        return next(createError(500, error));
      });
  },

  // let creator upload own song
  uploadSong: (req, res, next) => {
    const oldPath = path.join(__dirname, `../public/${req.file.filename}`);
    const newPath = path.join(__dirname, `../songs/${Math.floor(Date.now() / 1000)}.${req.file.mimetype.split('/').pop()}`);

    fs.rename(oldPath, newPath);

    return res.status(200).json({
      ok: 1,
      message: 'Upload file success',
      url: `/songs/${Math.floor(Date.now() / 1000)}.${req.file.mimetype.split('/').pop()}`,
    });
  },

  // let creator create own song
  createSong: (req, res, next) => {
    const userId = req.user.id;
    const { title, genre, track, cover, info, lyrics } = req.body;

    if (!title.trim() || !genre || !track.trim() || !cover.trim() || !info.trim() || !lyrics.trim()) {
      return next(createError(400, 'Form is incomplete, all field are required'));
    }

    User.findByPk(userId)
      .then((user) => {
        Song.create({
          songId: Math.floor(Date.now() / 1000),
          userId: user.id,
          title,
          genre,
          track,
          cover,
          info,
          lyrics,
        })
          .then(() => {
            return res.status(200).json({
              ok: 1,
              message: 'Create song success',
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

  // let creator update own song
  updateSong: (req, res, next) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, genre, cover, info, lyrics } = req.body;

    if (!title.trim() || !genre || !cover.trim() || !info.trim() || !lyrics.trim()) {
      return next(createError(400, 'Form is incomplete, all field are required'));
    }

    Song.findOne({
      where: {
        songId: id,
      },
    })
      .then((song) => {
        if (!song) {
          return next(createError(401, 'Song not found'));
        }

        if (song.userId !== userId) {
          return next(createError(400, 'Permission Denied'));
        }

        Song.update(
          {
            title,
            genre,
            cover,
            info,
            lyrics,
          },
          {
            where: {
              id: song.id,
            },
          }
        )
          .then(() => {
            return res.status(200).json({
              ok: 1,
              message: 'Creator update information of song success',
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

  // let creator delete own song
  deleteSong: (req, res, next) => {
    const userId = req.user.id;
    const { id } = req.params;

    Song.findOne({
      where: {
        songId: id,
      },
    })
      .then((song) => {
        if (!song) {
          return next(createError(401, 'Song not found'));
        }

        if (song.userId !== userId) {
          return next(createError(400, 'Permission Denied'));
        }

        Song.destroy({
          where: {
            id: song.id,
          },
        })
          .then(() => {
            return res.status(200).json({
              ok: 1,
              message: 'Creator deleted the song success',
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

module.exports = songController;
