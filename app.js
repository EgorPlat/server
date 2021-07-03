const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const cors = require('cors'); // сервер мог обрабатывать корс запрос с другихдоменов
const morgan = require('morgan') // логирование запросов
const mongoose = require('mongoose'); 
const keys = require('./config/keys');
const passport = require('passport');

mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('МонгоДБ успешно подключена!'))
    .catch(error => console.log(error))

app.use(passport.initialize())
require('./middleware/passport.js')(passport) 

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/api/auth', authRoutes)

module.exports = app;