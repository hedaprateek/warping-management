'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'WarpingProgram',
        'gatepass',
        {
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'Outward',
        'gatepass',
        {
          type: Sequelize.STRING,
        },
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
