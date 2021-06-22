'use strict';

const { DATEONLY } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /* Comment the below return to run migrations */
    return;
    await queryInterface.bulkInsert('Parties', [{
      name: "Tithiksha Enterprise",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Party",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "B.R Enterprise",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Party",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Nakuldev Textile",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Party",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Harish Textile",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Party",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Raghavendra Textile",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Party",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Sanjay Bohra",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Party",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Vivek Corporation",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Party",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Bhadrakali Textile",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Party",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Shri Krishna Textile",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Party",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "S.N Laddha and Sons",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Party",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Kavita Cottex",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Party",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Siotia",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Bharat Bohra",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Garthode",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Karisidh Text",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Khamkar",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Shirgave",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Sabale",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Gugale",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Ashok",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Ajay Aman",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Mahalaxmi",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "S N Laddha",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "SB",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Jyoti",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "D.K",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "B.T",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Kiran Ketkale",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Shivraj",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Mudgal",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Shankar Patil",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "GNK",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Dayma",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "KSPL",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "Varute",
      address: "ABCD",
      gstin: "ABCDEF",
      contact: "01234567890",
      isWeaver: "Weaver",
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    await queryInterface.bulkInsert('Qualities', [{
      name: "150 Roto",
      desc: "34",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 Black",
      desc: "34",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 White",
      desc: "32",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 Red",
      desc: "34.5",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 N Blue",
      desc: "34.5",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 Firojee",
      desc: "34.5",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 Mustard",
      desc: "34.5",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 Sky Blue",
      desc: "34.5",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 Skin",
      desc: "34.5",
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
    await queryInterface.bulkInsert('Inward', [{
      date: Sequelize.literal('DATE("2021-04-03")'),
      partyId: "3",
      gatepass: "",
      qualityId: "3",
      qtyBags: "32",
      qtyCones: "208",
      lotNo: "Wellknown",
      netWt: "948.33",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      date: Sequelize.literal('DATE("2021-04-01")'),
      partyId: "1",
      gatepass: "",
      qualityId: "2",
      qtyBags: "16",
      qtyCones: "128",
      lotNo: "Wellknown",
      netWt: "438.4",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      date: Sequelize.literal('DATE("2021-05-15")'),
      partyId: "2",
      gatepass: "",
      qualityId: "3",
      qtyBags: "50",
      qtyCones: "344",
      lotNo: "Bhilosa",
      netWt: "1586.05",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      date: Sequelize.literal('DATE("2021-04-01")'),
      partyId: "2",
      gatepass: "",
      qualityId: "3",
      qtyBags: "34",
      qtyCones: "209",
      lotNo: "Bhilosa",
      netWt: "1116.63",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      date: Sequelize.literal('DATE("2021-04-03")'),
      partyId: "2",
      gatepass: "",
      qualityId: "2",
      qtyBags: "34",
      qtyCones: "261",
      lotNo: "Bhilosa",
      netWt: "1033.74",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      date: Sequelize.literal('DATE("2021-04-06")'),
      partyId: "1",
      gatepass: "",
      qualityId: "2",
      qtyBags: "39",
      qtyCones: "426",
      lotNo: "Bhilosa",
      netWt: "1225.67",
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    await queryInterface.bulkInsert('WarpingProgram', [{
      design: "",
      lassa:"110.0",
      cuts: "45.81",
      totalMeter: "5039.1",
      totalEnds: "5330",
      partyId:"3",
      weaverId: "13",
      date: Sequelize.literal('DATE("2021-05-15")'),
      filledBeamWt: "",
      emptyBeamWt: "",
      actualUsedYarn: "0.0",
      createdAt: new Date(),
      updatedAt: new Date()
      },{
      design: "",
      lassa:"110.0",
      cuts: "45.81",
      totalMeter: "5039.1",
      totalEnds: "5330",
      partyId:"3",
      weaverId: "13",
      date: Sequelize.literal('DATE("2021-05-15")'),
      filledBeamWt: "",
      emptyBeamWt: "",
      actualUsedYarn: "0.0",
      createdAt: new Date(),
      updatedAt: new Date()
      }]);

    await queryInterface.bulkInsert('WarpingQualities', [{
      warpId: "1",
      qualityId: "3",
      ends: "5330",
      count: "34.94",
      usedYarn: "454.036"
      },{
      warpId: "2",
      qualityId: "3",
      ends: "5330",
      count: "34.94",
      usedYarn: "454.036"
      }]);

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  };
}}
