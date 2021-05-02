const Sequelize = require('sequelize');
var router = require('express').Router();
const db = require('../db/models');

router.get('/', function(req, res) {
  if(req.query.partyId) {
    db.Inward.findAll({
      raw: true,
      attributes: ['qualityId'],
      where: {
        'partyId': req.query.partyId,
      },
    }).then((data)=>{
      console.log(data);
      let qualityIn = data.map((q)=>q.qualityId);
      console.log(qualityIn);
      db.Qualities.findAll({
        order: [['name', 'ASC']],
        raw: true,
        where: {
          id: qualityIn,
        },
      }).then((data)=>{
        res.status(200).json(data);
      })
      .catch(err => {
        res.status(500).json({message: err});
      });
    }).catch(err => {
      res.status(500).json({message: err});
    });
  } else {
    db.Qualities.findAll({
      order: [['name', 'ASC']],
      raw: true,
    }).then((data)=>{
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).json({message: err});
    });
  }
});

router.delete('/:id', function(req, res) {
  db.Qualities.destroy({
    where: {
      id: req.params.id,
    },
  }).then((data)=>{
    res.status(200).json(data);
  })
  .catch(err => {
    res.status(500).json({message: err});
  });
});

router.post('/', function(req, res) {
  let reqJson = req.body;
  db.Qualities.create({
    name: reqJson.name,
    desc: reqJson.desc,
  }).then((result)=>{
    res.status(200).json(result);
  }).catch((error)=>{
    res.status(500).json({message: error});
  });
});

router.put('/:id', function(req, res) {
  let reqJson = req.body;
  db.Qualities.update({
    name: reqJson.name,
    desc: reqJson.address,
  },{
    where: {
      id: reqJson.id,
    },
  }).then((result)=>{
    res.status(200).json(result);
  }).catch((error)=>{
    res.status(500).json({message: error});
  });
});

module.exports = router;