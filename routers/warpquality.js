const Sequelize = require('sequelize');
var router = require('express').Router();
const db = require('../db/models');

router.get('/', function(req, res) {
  db.WarpingQualities.findAll({
    raw: true,
  }).then((data)=>{
    res.status(200).json(data);
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
});

router.delete('/:id', function(req, res) {
  db.WarpingQualities.destroy({
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
  db.WarpingQualities.create({
    warpId: reqJson.warpId,
    qualityId: reqJson.qualityId,
    totalEnds: reqJson.totalEnds,
    usedYarn: reqJson.usedYarn
  }).then((result)=>{
    res.status(200).json(result);
  }).catch((error)=>{
    res.status(500).json({message: error});
  });
});

router.put('/:id', function(req, res) {
  let reqJson = req.body;
  db.WarpingQualities.update({
    warpId: reqJson.warpId,
    qualityId: reqJson.qualityId,
    totalEnds: reqJson.totalEnds,
    usedYarn: reqJson.usedYarn
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