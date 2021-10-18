const express = require('express');
const cors = require('cors');
const app = express();
const auth = require('./routes/auth');
const meals = require('./routes/meal');
const orders = require('./routes/order');

app.use(express.static(__dirname + '/public'));

//cuando lo subamos a un servidor este tomara el puerto que se brinda o de lo contrario el que definimos 
app.set('port',process.env.PORT || 3000);// process.env.PORT es como decirle que tome el puerto del sistema operativo 

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.use('/api/auth', auth);
app.use('/api/meal', meals);
app.use('/api/order', orders);


module.exports = app;