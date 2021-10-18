const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.set('useFindAndModify', false);

const mealsSchema = new Schema({
    name: String,
    desc: String,
})

module.exports = mongoose.model('Meals',mealsSchema);