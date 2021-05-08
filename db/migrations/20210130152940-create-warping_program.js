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
      lassa: {
        type: Sequelize.REAL
      },
      cuts: {
        type: Sequelize.REAL
      },
      totalMeter: {
        type: Sequelize.REAL
      },
      totalEnds: {
        type: Sequelize.INTEGER
      },
      partyId: {
        type: Sequelize.INTEGER
      },
      weaverId: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATEONLY
      },
      filledBeamWt: {
        type: Sequelize.REAL
      },
      emptyBeamWt: {
        type: Sequelize.REAL
      },
      actualUsedYarn: {
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
    return queryInterface.dropTable('WarpingProgram');
  }
};