const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();

//路由引入
const indexRouter = require('./routes/index');
const portalRouter = require('./routes/portal')
const aisysRouter = require('./routes/aisys')
const devopsRouter = require('./routes/devops')

const testRouter = require('./routes/test')

//路由挂载
app.use('/', indexRouter);
app.use('/test',testRouter)
app.use('/portal',portalRouter)
app.use('/aisys',aisysRouter)
app.use('/devops',devopsRouter)


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//静态文件
app.use(express.static(path.join(__dirname, 'public')));

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

module.exports = app;
