const db = require('../db/models');
const _ = require('lodash');

async function deleteSetNo(setNo, t) {
  let result = await db.WarpingProgram.findOne({
    where: {
      setNo: setNo,
    }
  });
  if(result) {
    return true;
  }
  result = await db.Outward.findOne({
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

module.exports = {
  addSetNo,
  deleteSetNo
}