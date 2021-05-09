const Sequelize = require('sequelize');
var router = require('express').Router();
const db = require('../db/models');

router.get('/', function (req, res) {
  db.Settings.findOne({
    raw: true,
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    });
});

router.put('/', function (req, res) {
  let reqJson = req.body;
  db.Settings.update(
    {
      companyName: reqJson.companyName,
      companyAddress: reqJson.companyAddress,
      companyGst: reqJson.companyGst,
      companyContact: reqJson.companyContact,
    },
    {
      where: {},
    }
  )
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
});

module.exports = router;
