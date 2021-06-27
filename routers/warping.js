const Sequelize = require('sequelize');
var router = require('express').Router();
const db = require('../db/models');
const { addSetNo, deleteSetNo } = require('./utils');

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
  let where = {};
  if(req.query.partyId) {
    where.partyId = req.query.partyId;
  }
  if(req.query.setNo) {
    where.setNo = req.query.setNo;
  }
  db.WarpingProgram.findAll({
    raw: false,
    where: where,
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

router.delete('/:id', async function(req, res) {
  let result = await db.WarpingProgram.findOne({
    where: {
      id: req.params.id,
    },
  })
  await db.WarpingQualities.destroy({
    where: {
      warpId: req.params.id,
    },
  });
  await db.WarpingProgram.destroy({
    where: {
      id: req.params.id,
    },
  });
  await deleteSetNo(result.setNo);
  res.status(200).json({});
});


router.post('/', async function(req, res) {
  let reqJson = req.body;
  let retVal = {};
  let isValid = await addSetNo(reqJson.setNo, reqJson.partyId);
  if(!isValid) {
    res.status(500).json({message: 'Set number is already used by other party.'});
    return;
  }
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
    retVal = result.toJSON();
    db.WarpingQualities.bulkCreate(reqJson.qualities.map((quality)=>({
      warpId: result.id,
      qualityId: quality.qualityId,
      ends: quality.ends,
      count: quality.count,
      usedYarn: quality.usedYarn,
    }))).then(()=>{
      retVal.qualities = reqJson.qualities;
      res.status(200).json(retVal);
    }).catch((error)=>{
      res.status(500).json({message: error});
    });
  }).catch((error)=>{
    res.status(500).json({message: error});
  });
});

router.put('/:id', async function(req, res) {
  let reqJson = req.body;
  let isValid = await addSetNo(reqJson.setNo, reqJson.partyId);
  if(!isValid) {
    res.status(500).json({message: 'Set number is already used by other party.'});
    return;
  }

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