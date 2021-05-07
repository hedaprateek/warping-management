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

module.exports = router;