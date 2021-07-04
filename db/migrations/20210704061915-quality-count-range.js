'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.renameColumn('Qualities', 'desc', 'maxCount');
     await queryInterface.changeColumn('Qualities', 'maxCount', {
      type: Sequelize.REAL,
    },);
     await queryInterface.addColumn(
      'Qualities',
      'minCount',
      {
        type: Sequelize.REAL,
      },
    );
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
