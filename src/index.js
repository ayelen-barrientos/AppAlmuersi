require('dotenv').config();
require('./database');
const app = require('./app');
const bodyParser = require ('body-parser')

// app.use(express.urlencoded({ extended: false }));

app.listen(app.get('port'), () => console.log(`nuestro servidor esta escuchando en el puerto ${app.get('port')}`))
