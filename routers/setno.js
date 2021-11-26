const Sequelize = require('sequelize');
var router = require('express').Router();
const db = require('../db/models');

router.get('/check/:id', async function(req, res) {
  let result = await db.PartySetNo.findOne({
    attributes: ['setNo', 'partyId'],
    raw: true,
    where: {
      setNo: req.params.id,
    },
  });
  if(result) {
    res.status(200).json('Y');
  }
  res.status(200).json('N');
});

router.get('/:partyId', function(req, res) {
  db.PartySetNo.findAll({
    attributes: ['setNo'],
    raw: false,
    where: {
      partyId: req.params.partyId
    },
    order: [['setNo', 'ASC']]
  }).then((data)=>{
    res.status(200).json(data);
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
});


module.exports = router;