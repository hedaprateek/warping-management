const db = require('../db/models');
const _ = require('lodash');

async function deleteSetNo(setNo, partyId) {
  let result = await db.PartySetNo.findOne({
    attributes: ['setNo', 'partyId'],
    raw: true,
    where: {
      setNo: setNo,
      partyId: partyId,
    },
  });
  if(result && result.length == 1) {
    await db.PartySetNo.destroy({
      where: {
        setNo: setNo,
        partyId: partyId,
      },
    });
  }
  return true;
}

async function addSetNo(setNo, partyId) {
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
    });
  } else if(result['partyId'] != partyId) {
    return false;
  }
  return true;
}

module.exports = {
  addSetNo,
  deleteSetNo
}