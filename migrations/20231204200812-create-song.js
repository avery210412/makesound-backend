'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Songs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      song_id: {
        allowNull: false,
        unique: true,
        type: Sequelize.INTEGER,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      genre: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      track: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      cover: {
        type: Sequelize.STRING,
      },
      play_count: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      info: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      lyrics: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Songs');
  },
};
