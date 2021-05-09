const Sequelize = require('sequelize');
var router = require('express').Router();
const db = require('../db/models');
const Op = Sequelize.Op;

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
      'gatepass', [Sequelize.col('QualityDetails.name'), 'quality'], 'lotNo', 'netWt'],
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
        netWt: row.netWt
      });
    })

    res.status(200).json(retVal);
  })
  .catch(err => {
    console.error('DB execute error:', err);
    res.status(500).json({message: err});
  });
});

router.get('/outward', function(req, res) {
  let where = {
    date: {
      [Op.gte]: req.query.from_date,
      [Op.lte]: req.query.to_date,
    }
  };
  if(req.query.party_id) {
    where.partyId = parseInt(req.query.party_id);
  }

  let programReport = db.WarpingProgram.findAll({
    attributes: [
      'weaverId', 'design', 'totalMeter', 'totalEnds', 'actualUsedYarn'],
    raw: false,
    where: where,
    include: [{model: db.WarpingQualities, as: 'qualities'}],
  });

  let outwardReport = db.Outward.findAll({
    attributes: ['weaverId', 'qualityId', 'netWt'],
    raw: false,
    where: where,
    include: [{model: db.OutwardBags, as: 'bags'}],
  });

  let inwardReport = db.Inward.findAll({
    attributes: [
      'gatepass', 'qualityId', 'lotNo', 'netWt'],
    order: [['gatepass', 'DESC']],
    raw: true,
    where: where,
  });

  Promise.all([programReport, outwardReport, inwardReport]).then((reports)=>{
    let retVal = {};
    let programData = retVal['programData'] = {};
    reports[0].forEach((row)=>{
      let weaver = programData[row.weaverId] = programData[row.weaverId] || [];
      console.log(row.qualities);
      weaver.push({
        design: row.design,
        totalMeter: row.totalMeter,
        totalEnds: row.totalEnds,
        actualUsedYarn: row.actualUsedYarn,
        qualities: row.qualities,
      });
    });

    let outwardData = retVal['outwardData'] = {};
    reports[1].forEach((row)=>{
      let weaver = outwardData[row.weaverId] = outwardData[row.weaverId] || [];
      weaver.push({
        qualityId: row.qualityId,
        netWt: row.netWt,
        bags: row.bags,
      });
    });

    let inwardData = retVal['inwardData'] = {};
    reports[2].forEach((row)=>{
      let quality = inwardData[row.qualityId] = inwardData[row.qualityId] || [];
      quality.push({
        date: row.date,
        gatepass: row.gatepass,
        lotNo: row.lotNo,
        netWt: row.netWt
      });
    });
    res.status(200).json(retVal);
  })
  .catch(err => {
    console.error('DB execute error:', err);
    res.status(500).json({message: err});
  });
});

module.exports = router;