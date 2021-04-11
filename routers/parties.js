const Sequelize = require('sequelize');
var router = require('express').Router();
const db = require('../db/models');

router.get('/', function(req, res) {
  db.Parties.findAll({
    order: [['name', 'ASC']],
    raw: true,
  }).then((data)=>{
    res.status(200).json(data);
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
});

router.delete('/:id', function(req, res) {
  db.Parties.destroy({
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
  db.Parties.create({
    name: reqJson.name,
    address: reqJson.address,
    gstin: reqJson.gstin,
    contact: reqJson.contact,
    isWeaver: reqJson.isWeaver,
  }).then((result)=>{
    res.status(200).json(result);
  }).catch((error)=>{
    res.status(500).json({message: error});
  });
});

router.put('/:id', function(req, res) {
  let reqJson = req.body;
  db.Parties.update({
    name: reqJson.name,
    address: reqJson.address,
    gstin: reqJson.gstin,
    contact: reqJson.contact,
    isWeaver: reqJson.isWeaver,
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