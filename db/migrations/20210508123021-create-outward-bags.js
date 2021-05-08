'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OutwardBags', {
      outwardId: {
        type: Sequelize.INTEGER
      },
      cones: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATEONLY
      },
      grossWt: {
        type: Sequelize.REAL
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('OutwardBags');
  }
};