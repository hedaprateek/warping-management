module.exports = (port) => {
  var express = require('express');
  var indexRouter = require('./routers/index');
  var cors = require("cors");
  var path = require('path');
  var bodyParser = require('body-parser')
  var exphbs  = require('express-handlebars');

  app = express();

  app.engine('html', exphbs());
  app.set('view engine', 'html');

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))

  // parse application/json
  app.use(bodyParser.json())
  app.use(cors({ origin: true, credentials: true }));

  /* Routes */
  app.use(express.static(path.resolve(__dirname, 'build')));
  // app.use(express.static(path.resolve(__dirname, 'views','dist')));
  app.use('/', indexRouter);
  app.use('/api/parties', require('./routers/parties'));
  app.use('/api/qualities', require('./routers/qualities'));
  app.use('/api/companies', require('./routers/companies'));
  app.use('/api/inward', require('./routers/inward'));
  app.use('/api/warping', require('./routers/warping'));
  app.use('/api/outward', require('./routers/outward'));
  app.use('/api/reports', require('./routers/reports'));
  app.use('/api/misc', require('./routers/misc'));
  app.use('/api/setno', require('./routers/setno'));

  app.listen(port || 7227, console.log(`App listening at http://localhost:${port}`));
};