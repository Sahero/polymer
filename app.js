var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var https = require('https');
const fs = require('fs');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());


app.get('/',(req, res) => {
    res.send('cannot access');
});

app.use('/users', require('./routes/users'));
app.use('/bettercallsaul', require('./routes/bettercallsaul'));
app.use('/fm', require('./routes/fmdb'));

app.get('*',(req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send(err.message);
});

//console.log(app.get('env'));
var port = process.env.PORT || 3000;

var key = fs.readFileSync('config/private.key');
var cert = fs.readFileSync( 'config/primary.crt' );

var options = {
    key: key,
    cert: cert
};

https.createServer(options, app, function (req, res, err) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        if(err) {
           console.log(err);
        }
        console.log('listening in https://localhost:' + port);

}).listen(port);
