'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Collection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Collection.belongsTo(models.Playlist, { foreignKey: 'playlistId' });
      Collection.belongsTo(models.Song, { foreignKey: 'songId' });
    }
  }
  Collection.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      playlistId: DataTypes.INTEGER,
      songId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Collection',
      underscored: true,
      tableName: 'Collections',
    }
  );
  return Collection;
};
