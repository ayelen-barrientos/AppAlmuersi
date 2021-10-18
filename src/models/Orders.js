const mongoose = require ('mongoose')
const Schema = mongoose.Schema
mongoose.set('useFindAndModify', false);

const Orders = mongoose.model('Order', new Schema({
    meals_id: {type: Schema.Types.ObjectId, ref:'Meal'},
    user_id: String,
}))

module.exports = Orders