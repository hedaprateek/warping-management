module.exports = () => {
  var express = require('express');
  var indexRouter = require('./routers/index');
  var cors = require("cors");
  var path = require('path');
  var bodyParser = require('body-parser')
  var exphbs  = require('express-handlebars');

  app = express();

  app.set('views', path.resolve(__dirname, 'views', 'pages'));
  app.engine('html', exphbs());
  app.set('view engine', 'html');

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))

  // parse application/json
  app.use(bodyParser.json())
  app.use(cors({ origin: true, credentials: true }));

  /* Routes */
  app.use(express.static(path.resolve(__dirname, 'views','dist')));
  app.use('/', indexRouter);
  app.use('/api/parties', require('./routers/parties'));
  app.use('/api/qualities', require('./routers/qualities'));
  app.use('/api/inward', require('./routers/inward'));
  app.use('/api/warping', require('./routers/warping'));
  app.use('/api/outward', require('./routers/outward'));
  app.use('/api/reports', require('./routers/reports'));

  var port = 7227;
  app.listen(port, console.log(`App listening at http://localhost:${port}`));
};