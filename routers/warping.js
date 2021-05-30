const Sequelize = require('sequelize');
var router = require('express').Router();
const db = require('../db/models');

router.get('/beamno/:id', async function(req, res) {
  let result = await db.WarpingProgram.findOne({
    attributes: ['setNo', 'partyId', [db.sequelize.fn('count', db.sequelize.col('id')), 'beamCount']],
    raw: true,
    where: {
      setNo: req.params.id,
    },
    group: ['setNo', 'partyId'],
  });
  let retVal = {
    partyId: null,
    beamNo: 1
  };
  if(result) {
    retVal.beamNo = result.beamCount+1;
    retVal.partyId = result.partyId;
  }
  res.status(200).json(retVal);
});

router.get('/', function(req, res) {
  db.WarpingProgram.findAll({
    raw: false,
    include: [
      {model: db.WarpingQualities, as: 'qualities'},
    ],
    attributes: {
      include: [
        [Sequelize.literal("DENSE_RANK() OVER (PARTITION BY `WarpingProgram`.`setNo` ORDER BY `WarpingProgram`.`date`, `WarpingProgram`.`id`)"), 'beamNo']
      ]
    },
    order: [['setNo', 'ASC']]
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
    actualUsedYarn: reqJson.actualUsedYarn,
    setNo: reqJson.setNo,
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

router.put('/:id', async function(req, res) {
  let reqJson = req.body;
  await db.WarpingProgram.update({
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
    actualUsedYarn: reqJson.actualUsedYarn,
    setNo: reqJson.setNo,
  },{
    where: {
      id: reqJson.id,
    },
  });

  await db.WarpingQualities.destroy({
    where: {
      warpId: reqJson.id,
    }
  });

  await db.WarpingQualities.bulkCreate(reqJson.qualities.map((quality)=>({
    id: quality.id,
    warpId: reqJson.id,
    qualityId: quality.qualityId,
    ends: quality.ends || 0,
    count: quality.count || 0,
    usedYarn: quality.usedYarn || 0,
  })));

  res.status(200).json({});
});

module.exports = router;