'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Inward', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      data: {
        type: Sequelize.STRING
      },
      partyId: {
        type: Sequelize.INTEGER
      },
      gatepass: {
        type: Sequelize.STRING
      },
      qualityId: {
        type: Sequelize.INTEGER
      },
      qtyBags: {
        type: Sequelize.INTEGER
      },
      qtyCones: {
        type: Sequelize.INTEGER
      },
      logNo: {
        type: Sequelize.STRING
      },
      netWt: {
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
    return queryInterface.dropTable('Inward');
  }
};