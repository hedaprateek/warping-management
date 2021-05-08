'use strict';

const { DATEONLY } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Parties', [{
      name: "B.R Textile",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Party",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Tithiksha Textile",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Party",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Shyam Sadi Center",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Party",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Ashok Yadav",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Mama Jadhav",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Mirasaheab",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    await queryInterface.bulkInsert('Qualities', [{
      name: "150 Roto Bhilosa",
      desc: "34",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 Black Bhilosa",
      desc: "32",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 Blue Bhilosa",
      desc: "35",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 Red Bhilosa",
      desc: "35",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 Pink Bhilosa",
      desc: "35",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "2/100 Samathana",
      desc: "22",
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    await queryInterface.bulkInsert('Inward', [{
      date: Sequelize.literal('DATE("now")'),
      partyId: "1",
      gatepass: "1",
      qualityId: "1",
      qtyBags: "100",
      qtyCones: "3200",
      lotNo: "2",
      netWt: "3200",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      date: Sequelize.literal('DATE("now")'),
      partyId: "1",
      gatepass: "2",
      qualityId: "2",
      qtyBags: "100",
      qtyCones: "1000",
      lotNo: "1",
      netWt: "1000",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      date: Sequelize.literal('DATE("now")'),
      partyId: "2",
      gatepass: "3",
      qualityId: "3",
      qtyBags: "200",
      qtyCones: "2000",
      lotNo: "1",
      netWt: "2000",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      date: Sequelize.literal('DATE("now")'),
      partyId: "2",
      gatepass: "4",
      qualityId: "4",
      qtyBags: "100",
      qtyCones: "500",
      lotNo: "2",
      netWt: "500",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      date: Sequelize.literal('DATE("now")'),
      partyId: "3",
      gatepass: "5",
      qualityId: "5",
      qtyBags: "50",
      qtyCones: "250",
      lotNo: "3",
      netWt: "250",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      date: Sequelize.literal('DATE("now")'),
      partyId: "3",
      gatepass: "6",
      qualityId: "6",
      qtyBags: "40",
      qtyCones: "200",
      lotNo: "4",
      netWt: "200",
      createdAt: new Date(),
      updatedAt: new Date()
    }]);


  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

