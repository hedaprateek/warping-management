const Sequelize = require('sequelize');
var router = require('express').Router();
const db = require('../db/models');


router.get('/', function(req, res) {
  db.Inward.findAll({
    order: [['gatepass', 'DESC']],
    raw: true,
  }).then((data)=>{
    res.status(200).json(data);
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
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