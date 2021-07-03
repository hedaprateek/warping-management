const Sequelize = require('sequelize');
var router = require('express').Router();
const db = require('../db/models');
const Op = Sequelize.Op;
const _ = require('lodash');

router.get('/inward', function(req, res) {
  let where = {
    date: {
      [Op.gte]: req.query.from_date,
      [Op.lte]: req.query.to_date,
    }
  };
  if(req.query.party_id) {
    where.partyId = parseInt(req.query.party_id);
  }
  if(req.query.qualities && req.query.qualities.length > 0) {
    where.qualityId = {
      [Op.in]: req.query.qualities.map((v)=>parseInt(v)),
    }
  }
  db.Inward.findAll({
    attributes: ['date', [Sequelize.col('PartyDetails.name'), 'party'],
      'gatepass', [Sequelize.col('QualityDetails.name'), 'quality'], 'lotNo', 'netWt', 'notes'],
    order: [['gatepass', 'DESC']],
    raw: true,
    where: where,
    include: ["PartyDetails", "QualityDetails"],
  }).then((data)=>{
    let retVal = {};
    data.forEach((row)=>{
      let party = retVal[row.party] = retVal[row.party] || {};
      let quality = party[row.quality] = party[row.quality] || [];
      quality.push({
        date: row.date,
        gatepass: row.gatepass,
        lotNo: row.lotNo,
        netWt: row.netWt,
        notes: row.notes,
      });
    })

    res.status(200).json(retVal);
  })
  .catch(err => {
    console.error('DB execute error:', err);
    res.status(500).json({message: err});
  });
});

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
  });
  return finalBalance;
}

router.get('/outward', async function(req, res) {
  let where = {
    date: {
      [Op.gte]: req.query.from_date,
      [Op.lte]: req.query.to_date,
    }
  };
  if(!req.query.party_id) {
    res.status(400).json({});
    return;
  }
  where.partyId = parseInt(req.query.party_id);
  if(req.query.set_no) {
    where.setNo = parseInt(req.query.set_no);
  }

  let inwardOpeningBalance = await getInwardOpenBalance(req.query.party_id, req.query.from_date, req.query.to_date);

  let programReport = await db.WarpingProgram.findAll({
    attributes: [
      'weaverId', 'lassa', 'cuts', 'totalMeter'],
    raw: false,
    where: where,
    nest: true,
    include: [{model: db.WarpingQualities, as: 'qualities'}],
  });

  delete where.setNo;

  let outwardReport = await db.Outward.findAll({
    attributes: ['weaverId', 'qualityId', 'netWt', 'date'],
    raw: false,
    where: where,
    include: [{model: db.OutwardBags, as: 'bags'}],
  });

  let inwardReport = await db.Inward.findAll({
    attributes: [
      'gatepass', 'qualityId', 'lotNo', 'netWt'],
    order: [['gatepass', 'DESC']],
    raw: true,
    where: where,
  });

  Promise.all([programReport, outwardReport, inwardReport]).then((reports)=>{
    let retVal = {'inwardOpeningBalance': inwardOpeningBalance};
    let programData = retVal['programData'] = {};

    reports[0].forEach((row)=>{
      let weaver = programData[row.weaverId] = programData[row.weaverId] || [];
      weaver.push({
        lassa: row.lassa,
        totalMeter: row.totalMeter,
        cuts: row.cuts,
        qualities: row.qualities,
      });
    });

    let outwardData = retVal['outwardData'] = {};
    reports[1].forEach((row)=>{
      let weaver = outwardData[row.weaverId] = outwardData[row.weaverId] || [];
      weaver.push({
        qualityId: row.qualityId,
        netWt: row.netWt,
        date: row.date,
        bags: row.bags,
      });
    });
    res.status(200).json(retVal);
  })
  .catch(err => {
    console.error('DB execute error:', err);
    res.status(500).json({message: err});
  });
});

router.get('/set', async function(req, res) {
  if(!req.query.set_no) {
    res.status(400).json({});
    return;
  }
  let where = {
    setNo: parseInt(req.query.set_no),
  };

  try {
    let retVal = {};
    let programReport = await db.WarpingProgram.findAll({
      attributes: [
        'partyId', 'weaverId', 'lassa', 'cuts', 'totalMeter'],
      raw: false,
      where: where,
      nest: true,
      include: [{model: db.WarpingQualities, as: 'qualities'}],
    });

    let partyId = null;
    let programData = retVal['programData'] = {};
    for(let row of programReport) {
      if(!partyId) {
        partyId = row.partyId;
      }
      let weaver = programData[row.weaverId] = programData[row.weaverId] || [];
      weaver.push({
        lassa: row.lassa,
        totalMeter: row.totalMeter,
        cuts: row.cuts,
        qualities: row.qualities,
      });
    }

    if(partyId) {
      where.partyId = partyId;
    }

    let outwardReport = await db.Outward.findAll({
      attributes: ['partyId', 'weaverId', 'qualityId', 'netWt', 'date'],
      raw: false,
      where: where,
      include: [{model: db.OutwardBags, as: 'bags'}],
    });

    let outwardData = retVal['outwardData'] = {};
    for(let row of outwardReport) {
      if(!partyId) {
        partyId = row.partyId;
      }
      let weaver = outwardData[row.weaverId] = outwardData[row.weaverId] || [];
      weaver.push({
        qualityId: row.qualityId,
        netWt: row.netWt,
        date: row.date,
        bags: row.bags,
      });
    }
    retVal.partyId = partyId;
    res.status(200).json(retVal);
  } catch (err) {
    console.error('DB execute error:', err);
    res.status(500).json({message: err});
  }
});

module.exports = router;