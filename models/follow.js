'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Follow.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      followerId: DataTypes.INTEGER,
      followingId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Follow',
      underscored: true,
      tableName: 'Follows',
    }
  );
  return Follow;
};
