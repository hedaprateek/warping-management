'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'WarpingProgram',
        'setNo',
        {
          type: Sequelize.INTEGER,
        },
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {

  }
};
