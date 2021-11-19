var router = require('express').Router();
const db = require('../db/models');
const { getInwardOpenBalance } = require('./utils');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


router.get('/', function(req, res) {
  let where = {
    date: {
      [Op.gte]: req.query.from_date,
      [Op.lte]: req.query.to_date,
    }
  };
  if(req.query.partyId) {
    where.partyId = req.query.partyId;
  }
  db.Inward.findAll({
    order: [['gatepass', 'DESC']],
    where: where,
    raw: true,
  }).then((data)=>{
    res.status(200).json(data);
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
});

router.get('/balance/:partyId', async function(req, res) {
  if(!req.params.partyId) {
    res.status(200).json({});
  }
  try {
    /* Live balance is nothing but tommorrow mornings opening balance */
    let from_date = new Date();
    from_date.setDate(from_date.getDate() + 1);
    let inwardOpeningBalance = await getInwardOpenBalance(req.params.partyId, from_date, from_date);
    res.status(200).json(inwardOpeningBalance);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    res.status(500).json(error);
  }
});

router.delete('/:id', function(req, res) {
  db.Inward.destroy({
    where: {
      id: req.params.id,
    },
  }).then((data)=>{
    res.status(200).json(data);
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
});

router.post('/', function(req, res) {
  let reqJson = req.body;
  db.Inward.create({
    date: reqJson.date,
    partyId: reqJson.partyId,
    gatepass: reqJson.gatepass,
    qualityId: reqJson.qualityId,
    qtyBags: reqJson.qtyBags,
    qtyCones: reqJson.qtyCones,
    lotNo: reqJson.lotNo,
    netWt: reqJson.netWt,
    qualityComp: reqJson.qualityComp,
    notes: reqJson.notes,
  }).then((result)=>{
    res.status(200).json(result);
  }).catch((error)=>{
    res.status(500).json({message: error});
  });
});

router.put('/:id', function(req, res) {
  let reqJson = req.body;
  db.Inward.update({
    date: reqJson.date,
    partyId: reqJson.partyId,
    gatepass: reqJson.gatepass,
    qualityId: reqJson.qualityId,
    qtyBags: reqJson.qtyBags,
    qtyCones: reqJson.qtyCones,
    lotNo: reqJson.lotNo,
    netWt: reqJson.netWt,
    qualityComp: reqJson.qualityComp,
    notes: reqJson.notes,
  },{
    where: {
      id: req.params.id,
    },
  }).then((result)=>{
    res.status(200).json(result);
  }).catch((error)=>{
    res.status(500).json({message: error});
  });
});

module.exports = router;