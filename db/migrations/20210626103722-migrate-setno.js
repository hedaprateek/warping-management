'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let res = await queryInterface.sequelize.query('select distinct partyId, setNo from WarpingProgram');
    let newRows = [];
    res[0].forEach(row => {
      if(row['setNo']) {
        newRows.push({partyId: row['partyId'], setNo: row['setNo'], createdAt: new Date(), updatedAt: new Date()});
      }
    });
    if(newRows.length > 0) {
      return queryInterface.bulkInsert('PartySetNo', newRows);
    }
    return true;
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
