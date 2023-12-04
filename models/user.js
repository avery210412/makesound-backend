'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: DataTypes.INTEGER,
      fullname: DataTypes.STRING,
      username: DataTypes.STRING,
      nickname: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar: DataTypes.STRING,
      location: DataTypes.STRING,
      gender: DataTypes.STRING,
      birth: DataTypes.DATE,
      introduce: DataTypes.TEXT,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
      underscored: true,
      tableName: 'Users',
    }
  );
  return User;
};
