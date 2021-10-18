
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);


console.log(process.env.MONGODB_URI);
const URI = process.env.MONGODB_URI;//process, objeto que tiene acceso a todo el sistema

mongoose.connect(URI,{
    useNewUrlParser: true,
    useUnifiedTopology:true
});

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('DB conectada');
});
