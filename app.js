const bodyParser = require('body-parser');
const cluster = require('cluster');
const dotenv = require('dotenv');
const express = require('express');
const favicon = require('serve-favicon');
const http = require('http');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const os = require('os');
const path = require('path');
const session = require('express-session');

const setLanguage = require('./middleware/setLanguage');

const Job = require('./cron/Job');

dotenv.config({ path: path.join(__dirname, '.env') });

const numCPUs = process.env.WEB_CONCURRENCY || os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++)
    cluster.fork();

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const app = express();
  const server = http.createServer(app);

  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/node101';
  const PORT = process.env.PORT || 3000;

  const indexRouteController = require('./routes/indexRoute');

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  mongoose.set('strictQuery', false);
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  app.use(express.static(path.join(__dirname, 'public')));
  app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(session({
    secret: process.env.SESSION_SECRET || 'node101',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGODB_URI
    })
  }));
  app.use(setLanguage);

  app.use('/', indexRouteController);

  server.listen(PORT, () => {
    console.log(`Server is on port ${PORT} as Worker ${cluster.worker.id} running @ process ${cluster.worker.process.pid}`);

    Job.start();
  });
};