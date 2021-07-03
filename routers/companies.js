const Sequelize = require('sequelize');
var router = require('express').Router();
const db = require('../db/models');

router.get('/', function(req, res) {
  db.CompanyAccounts.findAll({
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
  db.CompanyAccounts.destroy({
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
  db.CompanyAccounts.create({
    name: reqJson.name,
    address: reqJson.address,
    gst: reqJson.gst,
    contact: reqJson.contact,
    email: reqJson.email,
  }).then((result)=>{
    res.status(200).json(result);
  }).catch((error)=>{
    res.status(500).json({message: error});
  });
});

router.put('/:id', function(req, res) {
  let reqJson = req.body;
  db.CompanyAccounts.update({
    name: reqJson.name,
    address: reqJson.address,
    gst: reqJson.gst,
    contact: reqJson.contact,
    email: reqJson.email,
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