const db = require('../db/models');
const _ = require('lodash');
const { Op } = require('sequelize');

const ROUND_DECIMAL = 3;

function parse(num) {
  if(!isNaN(num) && num) {
    return Number(num);
  } else {
    return Number(0.0);
  }
}

function round(num) {
  num = parse(num);
  num = Math.round(num + "e" + ROUND_DECIMAL);
  return Number(num + "e" + -ROUND_DECIMAL);
}

async function deleteSetNo(setNo, t) {
  let result = await db.WarpingProgram.findOne({
    transaction: t,
    where: {
      setNo: setNo,
    }
  });
  if(result) {
    return true;
  }
  result = await db.Outward.findOne({
    transaction: t,
    where: {
      setNo: setNo,
    }
  });
  if(result) {
    return true;
  }
  await db.PartySetNo.destroy({
    transaction: t,
    where: {
      setNo: setNo,
    },
  });
  return true;
}

async function addSetNo(setNo, partyId, t) {
  if(_.isUndefined(setNo) || _.isNull(setNo)){
    return true;
  }
  let result = await db.PartySetNo.findOne({
    attributes: ['setNo', 'partyId'],
    raw: true,
    transaction: t,
    where: {
      setNo: setNo,
    },
  });
  if(!result) {
    await db.PartySetNo.create({
      setNo: setNo,
      partyId: partyId,
    }, {transaction: t});
  } else if(result['partyId'] != partyId) {
    return false;
  }
  return true;
}

async function getInwardOpenBalance(partyId, fromDate, toDate) {
  /* Find the total inward till to date */
  let where = {
    partyId: parseInt(partyId),
    date: {
      [Op.lte]: toDate,
    }
  };
  let res = await db.Inward.findAll({
    attributes: ['qualityId', [db.sequelize.fn('sum', db.sequelize.col('netWt')), 'netWt']],
    raw: true,
    where: where,
    group: ['qualityId'],
  });
  let inwardQualities = res;

  /* Find the total warping till from date minus 1 day */
  where = {
    partyId: parseInt(partyId),
    date: {
      [Op.lt]: fromDate,
    }
  };
  res = await db.WarpingProgram.findAll({
    attributes: [db.sequelize.col('qualities.qualityId'), [db.sequelize.fn('sum', db.sequelize.col('qualities.usedYarn')), 'netWt']],
    raw: true,
    where: where,
    group: [db.sequelize.col('qualities.qualityId')],
    include: [{model: db.WarpingQualities, as: 'qualities', attributes: ['qualityId', 'usedYarn'], required:false}]
  });
  let warpingQualities = res;

  /* Find the total yarn outward till from date minus 1 day */
  res = await db.Outward.findAll({
    attributes: [db.sequelize.col('qualityId'), [db.sequelize.fn('sum', db.sequelize.col('netWt')), 'netWt']],
    raw: true,
    where: where,
    group: [db.sequelize.col('qualityId')],
  });
  let outwardQualities = res;

  let finalBalance = {};
  inwardQualities.forEach((entry)=>{
    finalBalance[entry.qualityId] = entry.netWt;
    finalBalance[entry.qualityId] -= (_.find(warpingQualities, (w)=>w.qualityId==entry.qualityId)||{netWt: 0}).netWt;
    finalBalance[entry.qualityId] -= (_.find(outwardQualities, (w)=>w.qualityId==entry.qualityId)||{netWt: 0}).netWt;
    finalBalance[entry.qualityId] = round(finalBalance[entry.qualityId]);
  });
  return finalBalance;
}

async function getSetOpenBalance(setNo, toDate) {
  let finalBalance = {};
  setNo = parseInt(setNo);
  let res = await db.PartySetNo.findOne({
    attributes: ['partyId'],
    raw: true,
    where: {
      setNo: parseInt(setNo),
    },
  });
  if(!res) {
    return finalBalance;
  }
  let partyId = parseInt(res.partyId);

  /* Find the total inward till to date */
  let where = {
    partyId: parseInt(partyId),
    date: {
      [Op.lte]: toDate,
    }
  };
  res = await db.Inward.findAll({
    attributes: ['qualityId', [db.sequelize.fn('sum', db.sequelize.col('netWt')), 'netWt']],
    raw: true,
    where: where,
    group: ['qualityId'],
  });
  let inwardQualities = res;

  // /* Get the last set no previous to this */
  // res = await db.PartySetNo.findOne({
  //   attributes: ['setNo'],
  //   raw: true,
  //   where: {
  //     setNo: {
  //       [Op.lte]: setNo,
  //     },
  //     partyId: partyId,
  //   },
  //   offset: 1,
  //   limit: 1,
  // });
  // if(!res) {
  //   return finalBalance;
  // }
  // let lastSetNo = res.setNo;

  /* Find the total warping till last set no */
  where = {
    partyId: parseInt(partyId),
    setNo: {
      [Op.lt]: setNo,
    }
  };
  res = await db.WarpingProgram.findAll({
    attributes: [db.sequelize.col('qualities.qualityId'), [db.sequelize.fn('sum', db.sequelize.col('qualities.usedYarn')), 'netWt']],
    raw: true,
    where: where,
    group: [db.sequelize.col('qualities.qualityId')],
    include: [{model: db.WarpingQualities, as: 'qualities', attributes: ['qualityId', 'usedYarn'], required:false}]
  });
  let warpingQualities = res;

  /* Find the total yarn outward till from date minus 1 day */
  res = await db.Outward.findAll({
    attributes: [db.sequelize.col('qualityId'), [db.sequelize.fn('sum', db.sequelize.col('netWt')), 'netWt']],
    raw: true,
    where: where,
    group: [db.sequelize.col('qualityId')],
  });
  let outwardQualities = res;


  inwardQualities.forEach((entry)=>{
    finalBalance[entry.qualityId] = entry.netWt;
    finalBalance[entry.qualityId] -= (_.find(warpingQualities, (w)=>w.qualityId==entry.qualityId)||{netWt: 0}).netWt;
    finalBalance[entry.qualityId] -= (_.find(outwardQualities, (w)=>w.qualityId==entry.qualityId)||{netWt: 0}).netWt;
    finalBalance[entry.qualityId] = round(finalBalance[entry.qualityId]);
  });
  return finalBalance;
}



module.exports = {
  addSetNo,
  deleteSetNo,
  getInwardOpenBalance,
  getSetOpenBalance,
}