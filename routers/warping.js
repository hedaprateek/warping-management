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
  const t = await db.sequelize.transaction();

  try {
    let result = await db.WarpingProgram.findOne({
      where: {
        id: req.params.id,
      },
    })
    await db.WarpingQualities.destroy({
      transaction: t,
      where: {
        warpId: req.params.id,
      },
    });
    await db.WarpingProgram.destroy({
      transaction: t,
      where: {
        id: req.params.id,
      },
    });
    await deleteSetNo(result.setNo, t);
    await t.commit();
    res.status(200).json({});
  } catch(error) {
    await t.rollback();
    res.status(500).json({message: error});
  }
  res.status(200).json({});
});


router.post('/', async function(req, res) {
  let reqJson = req.body;
  let retVal = {};
  const t = await db.sequelize.transaction();

  try {
    let isValid = await addSetNo(reqJson.setNo, reqJson.partyId, t);
    if(!isValid) {
      res.status(500).json({message: 'Set number is already used by other party.'});
      return;
    }
    let result = await db.WarpingProgram.create({
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
    }, {transaction: t});
    retVal = result.toJSON();

    await db.WarpingQualities.bulkCreate(reqJson.qualities.map((quality)=>({
      warpId: result.id,
      qualityId: quality.qualityId,
      ends: quality.ends,
      count: quality.count,
      usedYarn: quality.usedYarn,
    })), {transaction: t});

    retVal.qualities = reqJson.qualities;
    await t.commit();
    res.status(200).json(retVal);
  } catch(error) {
    await t.rollback();
    res.status(500).json({message: error});
  }
});

router.put('/:id', async function(req, res) {
  let reqJson = req.body;
  const t = await db.sequelize.transaction();

  try {
    let isValid = await addSetNo(reqJson.setNo, reqJson.partyId, t);
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
      transaction: t,
      where: {
        id: reqJson.id,
      },
    });

    await db.WarpingQualities.destroy({
      where: {
        warpId: reqJson.id,
      }
    }, {transaction: t});

    await db.WarpingQualities.bulkCreate(reqJson.qualities.map((quality)=>({
      id: quality.id,
      warpId: reqJson.id,
      qualityId: quality.qualityId,
      ends: quality.ends || 0,
      count: quality.count || 0,
      usedYarn: quality.usedYarn || 0,
    })), {transaction: t});

    await t.commit();
    res.status(200).json({});
  } catch(error) {
    await t.rollback();
    res.status(500).json({message: error});
  }
});

module.exports = router;