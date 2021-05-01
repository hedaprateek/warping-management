const Sequelize = require('sequelize');
var router = require('express').Router();
const db = require('../db/models');
const Op = Sequelize.Op;

router.get('/inward', function(req, res) {
  // {
  //   party_id: '2',
  //   qualities: [ '1' ],
  //   from_date: '2021-03-31T18:30:00.000Z',
  //   to_date: '2021-04-29T18:30:00.000Z'
  // }
  console.log(req.query);
  let where = {
    date: {
      [Op.gte]: req.query.from_date,
      [Op.lte]: req.query.to_date,
    }
  };
  if(req.query.party_id) {
    where.partyId = parseInt(req.query.party_id);
  }
  if(req.query.qualities?.length > 0) {
    where.qualityId = {
      [Op.in]: req.query.qualities.map((v)=>parseInt(v)),
    }
  }
  console.log(where);
  db.Inward.findAll({
    order: [['gatepass', 'DESC']],
    raw: true,
    where: where,
  }).then((data)=>{
    res.status(200).json(data);
  })
  .catch(err => {
    console.error('DB execute error:', err);
    res.status(500).json({message: error});
  });
});

module.exports = router;