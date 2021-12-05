const Sequelize = require('sequelize');
var router = require('express').Router();
const db = require('../db/models');
const { addSetNo, deleteSetNo } = require('./utils');
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
  if(req.query.setNo) {
    where.setNo = req.query.setNo;
  }
  db.Outward.findAll({
    raw: false,
    include: [ {model: db.OutwardBags, as: 'bags'} ],
    where: where,
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
    let result = await db.Outward.findOne({
      where: {
        id: req.params.id,
      },
    })
    await db.OutwardBags.destroy({
      transaction: t,
      where: {
        outwardId: req.params.id,
      },
    });
    await db.Outward.destroy({
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
});

router.post('/', async function(req, res) {
  let reqJsonBulk = req.body;
  const t = await db.sequelize.transaction();
  /* reqJsonBulk will be an array since it is a bulk operation */
  try {
    for(const reqJson of reqJsonBulk) {
      let isValid = await addSetNo(reqJson.setNo, reqJson.partyId, t);
      if(!isValid) {
        await t.rollback();
        res.status(500).json({message: 'Set number is already used by other party.'});
        return;
      }

      let result = await db.Outward.create({
        setNo: reqJson.setNo,
        partyId: reqJson.partyId,
        weaverId: reqJson.weaverId,
        qualityId: reqJson.qualityId,
        date: reqJson.date,
        emptyConeWt: reqJson.emptyConeWt,
        emptyBagWt: reqJson.emptyBagWt,
        netWt: reqJson.netWt,
        gatepass: reqJson.gatepass,
      }, {transaction: t});

      await db.OutwardBags.bulkCreate(reqJson.bags.map((bag)=>({
        outwardId: result.id,
        cones: bag.cones,
        date: bag.date,
        grossWt: bag.grossWt,
      })), {transaction: t});

      result.bags = reqJson.bags;
    }
    await t.commit();
    res.status(200).json({});
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
      await t.rollback();
      res.status(500).json({message: 'Set number is already used by other party.'});
      return;
    }

    await db.Outward.update({
      setNo: reqJson.setNo,
      partyId: reqJson.partyId,
      weaverId: reqJson.weaverId,
      qualityId: reqJson.qualityId,
      date: reqJson.date,
      emptyConeWt: reqJson.emptyConeWt,
      emptyBagWt: reqJson.emptyBagWt,
      netWt: reqJson.netWt,
      gatepass: reqJson.gatepass,
    },{
      transaction: t,
      where: {
        id: reqJson.id,
      },
    });

    await db.OutwardBags.destroy({
      transaction: t,
      where: {
        outwardId: reqJson.id,
      }
    });

    await db.OutwardBags.bulkCreate(reqJson.bags.map((bag)=>({
      id: bag.id,
      outwardId: reqJson.id,
      cones: bag.cones || 0,
      date: bag.date,
      grossWt: bag.grossWt || 0,
    })), {transaction: t});

    await t.commit();
    res.status(200).json({});
  } catch(error) {
    await t.rollback();
    res.status(500).json({message: error});
  }
});

module.exports = router;