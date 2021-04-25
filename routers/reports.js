const Sequelize = require('sequelize');
var router = require('express').Router();
const db = require('../db/models');

router.get('/inward', function(req, res) {
  console.log(req.params);
});

module.exports = router;