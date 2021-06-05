'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Outward',
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
