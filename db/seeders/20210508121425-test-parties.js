'use strict';

const { DATEONLY } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
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
    },
    {
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
    },
    {
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
      name: "150 Roto Wellknown",
      desc: "34",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 Black Wellknown",
      desc: "34",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 White Bhilosa",
      desc: "32",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 Black Bhilosa",
      desc: "35",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 Roto Bhilosa",
      desc: "35",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 Red Unify",
      desc: "35",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 Black Samathana",
      desc: "22",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 White Wellknown",
      desc: "35",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 N Blue Unify",
      desc: "35",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 Black Unify",
      desc: "35",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 Roto Indorama",
      desc: "35",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 Firojee Unify",
      desc: "35",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 Mustard Wellknown",
      desc: "35",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 Sky Blue Wellknown",
      desc: "35",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: "150 Skin Unify",
      desc: "35",
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    await queryInterface.bulkInsert('Inward', [{
      date: Sequelize.literal('DATE("now")'),
      partyId: "1",
      gatepass: "",
      qualityId: "15",
      qtyBags: "16",
      qtyCones: "128",
      lotNo: "",
      netWt: "438.4",
      createdAt: new Date(),
      updatedAt: new Date()
      },{
      date: Sequelize.literal('DATE("now")'),
      partyId: "2", 
      gatepass: "",	
      qualityId: "2",	 
      qtyBags: "50",	
      qtyCones: "344", 
      lotNo: "",		
      netWt: "1586.05",       
      createdAt: new Date(), 
      updatedAt: new Date()
      },{
      date: Sequelize.literal('DATE("now")'),
      partyId: "2", 
      gatepass: "",	
      qualityId: "2",	 
      qtyBags: "34",	
      qtyCones: "209", 
      lotNo: "",		
      netWt: "1116.63",       
      createdAt: new Date(), 
      updatedAt: new Date()
      },{
      date: Sequelize.literal('DATE("now")'),
      partyId: "2", 
      gatepass: "",	
      qualityId: "3",	 
      qtyBags: "34",	
      qtyCones: "261", 
      lotNo: "41254",	
      netWt: "1033.74",   
      createdAt: new Date(), 
      updatedAt: new Date()
      },{
      date: Sequelize.literal('DATE("now")'),
      partyId: "2", 
      gatepass: "",	
      qualityId: "7",	 
      qtyBags: "32",	
      qtyCones: "192", lotNo: "",		
      netWt: "980.8",	        
      createdAt: new Date(), 
      updatedAt: new Date()
      },{
      date: Sequelize.literal('DATE("now")'),
      partyId: "2", 
      gatepass: "",	
      qualityId: "7",	 
      qtyBags: "32",	
      qtyCones: "192", 
      lotNo: "",		
      netWt: "972.21",	    
      createdAt: new Date(), 
      updatedAt: new Date()
      },{
      date: Sequelize.literal('DATE("now")'),
      partyId: "2", 
      gatepass: "",	
      qualityId: "8",	 
      qtyBags: "49",	
      qtyCones: "306", 
      lotNo: "54024",	
      netWt: "1554.92" ,  
      createdAt: new Date(), 
      updatedAt: new Date()
      },{
      date: Sequelize.literal('DATE("now")'),
      partyId: "2", 
      gatepass: "",	
      qualityId: "10", 
      qtyBags: "40",	
      qtyCones: "240", 
      lotNo: "",		
      netWt: "1324.56",       
      createdAt: new Date(), 
      updatedAt: new Date()
      },{
      date: Sequelize.literal('DATE("now")'),
      partyId: "2", 
      gatepass: "",	
      qualityId: "10", 
      qtyBags: "20",	
      qtyCones: "120", 
      lotNo: "",		
      netWt: "661.44",	    
      createdAt: new Date(), 
      updatedAt: new Date()
      },{
      date: Sequelize.literal('DATE("now")'),
      partyId: "2", 
      gatepass: "",	
      qualityId: "8",	 
      qtyBags: "46",	
      qtyCones: "350", 
      lotNo: "54024",	
      netWt: "1363.33",   
      createdAt: new Date(), 
      updatedAt: new Date()
      },{
      date: Sequelize.literal('DATE("now")'),
      partyId: "2", 
      gatepass: "",	
      qualityId: "2",	 
      qtyBags: "52",	
      qtyCones: "394", 
      lotNo: "",		
      netWt: "1581.68",       
      createdAt: new Date(), 
      updatedAt: new Date()
      },{
      date: Sequelize.literal('DATE("now")'),
      partyId: "2", 
      gatepass: "",	
      qualityId: "2",	 
      qtyBags: "32",	
      qtyCones: "194", 
      lotNo: "",		
      netWt: "1029.36",       
      createdAt: new Date(), 
      updatedAt: new Date()
      },{
      date: Sequelize.literal('DATE("now")'),
      partyId: "2", 
      gatepass: "",	
      qualityId: "2",	 
      qtyBags: "16",	
      qtyCones: "0",	 
      lotNo: "",		
      netWt: "513.61",	    
      createdAt: new Date(), 
      updatedAt: new Date()
      },{
      date: Sequelize.literal('DATE("now")'),
      partyId: "2", 
      gatepass: "",	
      qualityId: "13", 
      qtyBags: "16",	
      qtyCones: "96",	 
      lotNo: "",		
      netWt: "463.95",	    
      createdAt: new Date(), 
      updatedAt: new Date()
      },{
      date: Sequelize.literal('DATE("now")'),
      partyId: "2", 
      gatepass: "",	
      qualityId: "13", 
      qtyBags: "24",	
      qtyCones: "0",	 
      lotNo: "",		
      netWt: "595.59",	    
      createdAt: new Date(), 
      updatedAt: new Date()
      },{
      date: Sequelize.literal('DATE("now")'),
      partyId: "3", 
      gatepass: "",	
      qualityId: "7",	 
      qtyBags: "32",	
      qtyCones: "208", 
      lotNo: "",		
      netWt: "948.33",	    
      createdAt: new Date(), 
      updatedAt: new Date()
      },{
      date: Sequelize.literal('DATE("now")'),
      partyId: "4", 
      gatepass: "",	
      qualityId: "4",	 
      qtyBags: "17",	
      qtyCones: "104", 
      lotNo: "",		
      netWt: "529.62",	    
      createdAt: new Date(),
      updatedAt: new Date()
      },{
      date: Sequelize.literal('DATE("now")'),
      partyId: "4", 
      gatepass: "",	
      qualityId: "5",	 
      qtyBags: "18",	
      qtyCones: "110", 
      lotNo: "53059",	
      netWt: "519.3",	    
      createdAt: new Date(), 
      updatedAt: new Date()
    },{
      date: Sequelize.literal('DATE("now")'),	
      partyId: "4", 
      gatepass: "",	
      qualityId: "5",	
      qtyBags: "17", 	
      qtyCones: "104", 
      lotNo: "", 
      netWt:"529.62", 
      createdAt: new Date(), 
      updatedAt: new Date()
      },{	
      date: Sequelize.literal('DATE("now")'), 
      partyId: "4", 
      gatepass: "", 
      qualityId: "6", 
      qtyBags: "18",	
      qtyCones: "110",
      lotNo: "53059",
      netWt: "519.3",	
      createdAt: new Date(), 
      updatedAt: new Date()
      },{	
      date: Sequelize.literal('DATE("now")'),	
      partyId: "4", 
      gatepass: "", 
      qualityId: "5", 
      qtyBags: "3",	
      qtyCones: "0",	
      lotNo: "",		
      netWt:"65.06",		
      createdAt: new Date(), 
      updatedAt: new Date()
      },{	
      date: Sequelize.literal('DATE("now")'),	
      partyId: "7", 
      gatepass: "", 
      qualityId: "5", 
      qtyBags: "30",	
      qtyCones: "0",	
      lotNo: "",		
      netWt:"946.63",		
      createdAt: new Date(), 
      updatedAt: new Date()
      },{	
      date: Sequelize.literal('DATE("now")'),	
      partyId: "7", 
      gatepass: "", 
      qualityId: "5", 
      qtyBags: "15",	
      qtyCones: "0",	
      lotNo: "",		
      netWt:"473.77",		
      createdAt: new Date(), 
      updatedAt: new Date()
      },{	
      date: Sequelize.literal('DATE("now")'),	
      partyId: "7", 
      gatepass: "", 
      qualityId: "5", 
      qtyBags: "40",	
      qtyCones: "0",	
      lotNo: "",		
      netWt:"1250.19",		
      createdAt: new Date(), 
      updatedAt: new Date()
      },{	
      date: Sequelize.literal('DATE("now")'),	
      partyId: "7", 
      gatepass: "", 
      qualityId: "5", 
      qtyBags: "25",	
      qtyCones: "0",	
      lotNo: "",		
      netWt:"800.95",		
      createdAt: new Date(), 
      updatedAt: new Date()
      },{	
      date: Sequelize.literal('DATE("now")'),
      partyId: "7", 
      gatepass: "", 
      qualityId: "5", 
      qtyBags: "65",	
      qtyCones: "430",
      lotNo: "",		
      netWt:"2070.17",		
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
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"110.0",
        cuts: "45.81",
        totalMeter: "5039.1",
        totalEnds: "5330",
        partyId:"3",
        weaverId: "13",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"110.0",
        cuts: "65.36",
        totalMeter: "7189.6",
        totalEnds: "2500",
        partyId:"4",
        weaverId: "14",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"110.0",
        cuts: "65.0",
        totalMeter: "7150.0",
        totalEnds: "2446",
        partyId:"4",
        weaverId: "14",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"110.0",
        cuts: "36.0",
        totalMeter: "3960.0",
        totalEnds: "2446",
        partyId:"4",
        weaverId: "15",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"110.0",
        cuts: "36.0",
        totalMeter: "3960.0",
        totalEnds: "2446",
        partyId:"4",
        weaverId: "15",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"115.0",
        cuts: "33.0",
        totalMeter: "3795.0",
        totalEnds: "3860",
        partyId:"7",
        weaverId: "16",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"115.0",
        cuts: "33.0",
        totalMeter: "3795.0",
        totalEnds: "3860",
        partyId:"7",
        weaverId: "16",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"115.0",
        cuts: "33.0",
        totalMeter: "3795.0",
        totalEnds: "3860",
        partyId:"7",
        weaverId: "16",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"0115.0",
        cuts: "33.0",
        totalMeter: "3795.0",
        totalEnds: "3860",
        partyId:"7",
        weaverId: "16",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"1115.0",
        cuts: "33.0",
        totalMeter: "3795.0",
        totalEnds: "3860",
        partyId:"7",
        weaverId: "17",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"2115.0",
        cuts: "33.0",
        totalMeter: "3795.0",
        totalEnds: "3860",
        partyId:"7",
        weaverId: "17",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"3115.0",
        cuts: "33.0",
        totalMeter: "3795.0",
        totalEnds: "3860",
        partyId:"7",
        weaverId: "17",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"4115.0",
        cuts: "33.0",
        totalMeter: "3795.0",
        totalEnds: "3860",
        partyId:"7",
        weaverId: "17",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"5115.0",
        cuts: "33.0",
        totalMeter: "3795.0",
        totalEnds: "3860",
        partyId:"7",
        weaverId: "17",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"6115.0",
        cuts: "33.0",
        totalMeter: "3795.0",
        totalEnds: "3860",
        partyId:"7",
        weaverId: "17",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"7115.0",
        cuts: "33.0",
        totalMeter: "3795.0",
        totalEnds: "3860",
        partyId:"7",
        weaverId: "17",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"8115.0",
        cuts: "33.0",
        totalMeter: "3795.0",
        totalEnds: "3860",
        partyId:"7",
        weaverId: "17",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"2115.0",
        cuts: "40.0",
        totalMeter: "4600.0",
        totalEnds: "3260",
        partyId:"7",
        weaverId: "19",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"3115.0",
        cuts: "40.0",
        totalMeter: "4600.0",
        totalEnds: "3260",
        partyId:"7",
        weaverId: "19",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"4115.0",
        cuts: "40.0",
        totalMeter: "4600.0",
        totalEnds: "3260",
        partyId:"7",
        weaverId: "19",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"5115.0",
        cuts: "40.0",
        totalMeter: "4600.0",
        totalEnds: "3260",
        partyId:"7",
        weaverId: "19",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"6115.0",
        cuts: "40.0",
        totalMeter: "4600.0",
        totalEnds: "3260",
        partyId:"7",
        weaverId: "19",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"7115.0",
        cuts: "40.0",
        totalMeter: "4600.0",
        totalEnds: "3260",
        partyId:"7",
        weaverId: "19",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"8115.0",
        cuts: "40.0",
        totalMeter: "4600.0",
        totalEnds: "3260",
        partyId:"7",
        weaverId: "18",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"9115.0",
        cuts: "40.0",
        totalMeter: "4600.0",
        totalEnds: "3260",
        partyId:"7",
        weaverId: "18",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"0115.0",
        cuts: "40.0",
        totalMeter: "4600.0",
        totalEnds: "3260",
        partyId:"7",
        weaverId: "18",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date() },
        
        {
        design: "",
        lassa:"1110.0",
        cuts: "36.0",
        totalMeter: "3960.0",
        totalEnds: "2647",
        partyId:"7",
        weaverId: "21",
        date: Sequelize.literal('DATE("now")'),
        filledBeamWt: "",
        emptyBeamWt: "",
        actualUsedYarn: "0.0",
        createdAt: new Date(),
        updatedAt: new Date()     
      
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

