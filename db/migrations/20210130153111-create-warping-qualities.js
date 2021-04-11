'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('WarpingQualities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      warpId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      qualityId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      totalEnds: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      usedYarn: {
        allowNull: false,
        type: Sequelize.REAL
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('WarpingQualities');
  }
};