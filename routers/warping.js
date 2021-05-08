const Sequelize = require('sequelize');
var router = require('express').Router();
const db = require('../db/models');

router.get('/', function(req, res) {
  db.WarpingProgram.findAll({
    raw: false,
    include: [ {model: db.WarpingQualities, as: 'qualities'} ],
  }).then((data)=>{
    res.status(200).json(data);
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
});

router.delete('/:id', function(req, res) {
  db.WarpingProgram.destroy({
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
  db.WarpingProgram.create({
    design: reqJson.design,
    lassa: reqJson.lassa,
    cuts: reqJson.cuts,
    totalMeter: reqJson.totalMeter,
    totalEnds: reqJson.totalEnds,
    partyId: reqJson.partyId,
    weaverId: reqJson.weaverId,
    date: reqJson.date,
    filledBeamWt: reqJson.filledBeamWt,
    emptyBeamWt: reqJson.emptyBeamWt,
    actualUsedYarn: reqJson.actualUsedYarn
  }).then((result)=>{
    db.WarpingQualities.bulkCreate(reqJson.qualities.map((quality)=>({
      warpId: result.id,
      qualityId: quality.qualityId,
      ends: quality.ends,
      count: quality.count,
      usedYarn: quality.usedYarn,
    }))).then(()=>{
      result.qualities = reqJson.qualities;
      res.status(200).json(result);
    }).catch((error)=>{
      res.status(500).json({message: error});
    });
  }).catch((error)=>{
    res.status(500).json({message: error});
  });
});

router.put('/:id', function(req, res) {
  let reqJson = req.body;
  db.WarpingProgram.update({
    design: reqJson.design,
    meter: reqJson.meter,
    partyId: reqJson.partyId,
    weaverId: reqJson.weaverId,
    date: reqJson.date,
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