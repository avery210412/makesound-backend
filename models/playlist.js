'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Playlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Playlist.hasMany(models.Collection);
      Playlist.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Playlist.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      playlistId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      cover: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Playlist',
      underscored: true,
      tableName: 'Playlists',
    }
  );
  return Playlist;
};
