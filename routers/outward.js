const Sequelize = require('sequelize');
var router = require('express').Router();
const db = require('../db/models');

router.get('/', function(req, res) {
  let where = {
    ...req.query,
  };
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

router.delete('/:id', function(req, res) {
  db.Outward.destroy({
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
  db.Outward.create({
    setNo: reqJson.setNo,
    partyId: reqJson.partyId,
    weaverId: reqJson.weaverId,
    qualityId: reqJson.qualityId,
    date: reqJson.date,
    emptyConeWt: reqJson.emptyConeWt,
    emptyBagWt: reqJson.emptyBagWt,
    netWt: reqJson.netWt
  }).then((result)=>{
    db.OutwardBags.bulkCreate(reqJson.bags.map((bag)=>({
      outwardId: result.id,
      cones: bag.cones,
      date: bag.date,
      grossWt: bag.grossWt,
    }))).then(()=>{
      result.bags = reqJson.bags;
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
  console.log(reqJson);
  await db.Outward.update({
    setNo: reqJson.setNo,
    partyId: reqJson.partyId,
    weaverId: reqJson.weaverId,
    qualityId: reqJson.qualityId,
    date: reqJson.date,
    emptyConeWt: reqJson.emptyConeWt,
    emptyBagWt: reqJson.emptyBagWt,
    netWt: reqJson.netWt
  },{
    where: {
      id: reqJson.id,
    },
  });

  await db.OutwardBags.destroy({
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
  })));

  res.status(200).json({});
});

module.exports = router;