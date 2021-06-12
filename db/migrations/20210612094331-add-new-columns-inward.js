'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Inward',
        'qualityComp',
        {
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'Inward',
        'notes',
        {
          type: Sequelize.STRING,
        },
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
  }
};
