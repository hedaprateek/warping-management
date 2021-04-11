'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('WarpingProgram', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      design: {
        type: Sequelize.STRING
      },
      meter: {
        type: Sequelize.REAL
      },
      partyId: {
        type: Sequelize.INTEGER
      },
      weaverId: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('WarpingProgram');
  }
};