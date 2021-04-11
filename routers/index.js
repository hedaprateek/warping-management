var router = require('express').Router();

router.get('/', function(req, res) {
  res.render('index.html', {layout: false});
});

module.exports = router