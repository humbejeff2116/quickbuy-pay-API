





const express = require('express');
const uncaughtExceptions = require('./src/exceptions/uncaughtExceptions');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookie = require('cookie-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const apiRouter = require('./src/routes/apiRoutes');
const http = require('http');
const config = require('./src/config/config');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const connectToMongodb = require('./src/library/mongoDbConnection');
const compression = require('compression');
require('dotenv').config();
const port = config.app.serverPort || 4000;
const mongoConfig = {
    devDbURI: config.db.testURI,
    dbOptions: config.db.dbOptions
}
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 
}
const app = express();
app.disable('x-powered-by');
app.use(helmet( { contentSecurityPolicy: false } ));
connectToMongodb(mongoose, mongoConfig);
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');
app.use(uncaughtExceptions);
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookie( config.secret.cookieSecret));
app.use(session({
    secret: config.secret.sessionSecret,
    resave:true,
    saveUninitialized:true   
}));
app.use('/api/v1/', apiRouter);
app.use(( req, res)=> {
    res.status(404).json({Error: true, message: 'API endpoint does not exist'});
})
app.use((err, req, res, next)=> {
    console.error(err);
    next(err);
});
app.use((err, req, res, next)=> {
    res.status(500).json({ServerError: true, message: 'internal server error'});
});
function startServer() {
    var server = http.createServer(app).listen(port, ()=> console.log(`app started at port ${port}`));
    return server;
}
if(require.main === module) {
    startServer();
}else{
    module.exports = startServer;
}