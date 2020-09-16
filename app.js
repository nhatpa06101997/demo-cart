const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const path = require('path');
const config = require('./config/database');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(config.database,
{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
mongoose.connection.on('connected',()=>{
    console.log("Connect MongoDB!!");
});
mongoose.connection.on('error',error=>{
    console.log("Connect Error: ",error)
});

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'/public')));



app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
    // cookie: { secure: true }
  }))
app.locals.errors = null;
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


const adminCate = require('./routes/admin_cate');
const adminPro = require('./routes/admin_product');

app.use('/admin/cates',adminCate);
app.use('/admin/products',adminPro);

app.listen(port, ()=>{
    console.log("Listening in port: ",port);
});