'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Song.hasMany(models.Like);
      Song.hasMany(models.Comment);
      Song.hasMany(models.Collection);
      Song.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Song.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      songId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      genre: DataTypes.STRING,
      track: DataTypes.STRING,
      cover: DataTypes.STRING,
      playCount: DataTypes.INTEGER,
      info: DataTypes.TEXT,
      lyrics: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Song',
      underscored: true,
      tableName: 'Songs',
    }
  );
  return Song;
};
