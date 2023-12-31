'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Like.belongsTo(models.User, { foreignKey: 'userId' });
      Like.belongsTo(models.Song, { foreignKey: 'songId' });
    }
  }
  Like.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: DataTypes.INTEGER,
      songId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Like',
      underscored: true,
      tableName: 'Likes',
    }
  );
  return Like;
};
