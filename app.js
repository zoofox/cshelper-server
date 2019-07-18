var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var db = require('./config/db');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var kdxfRouter = require('./routes/kdxf');
var duiRouter = require('./routes/dui');
var aiqqRouter = require('./routes/aiqq');
var usersRouter = require('./routes/users');
var proxy = require('./routes/proxy');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//会化信息存储到mongoldb中
app.use(session({
	secret: db.cookieSecret,
	key: 'zoofox', //cookie name
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 30
	}, //30 days
	store: new MongoStore({
		url: 'mongodb://' + db.username + ':' + db.pwd + '@' + db.host + ':'+db.port+'/'+db.db,
		collection : 'sessions'
	})
}));

app.use('/', indexRouter);
app.use('/kdxf/', kdxfRouter);
app.use('/dui/', duiRouter);
app.use('/aiqq/', aiqqRouter);
app.use('/users', usersRouter);
app.use('/proxy', proxy);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

var url = 'mongodb://' + db.username + ':' + db.pwd + '@' + db.host + ':'+db.port+'/'+db.db;
mongoose.connect(url,{ useNewUrlParser: true });
mongoose.Promise = global.Promise;
mongoose.connection
.on('error', console.log)
.once('open', function(){
	console.log('mongodb connected~');
})
.on('close',function(){
	console.log('mongodb disconnected!')
});

module.exports = app;