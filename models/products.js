const mongoose = require('mongoose');
const schema = mongoose.Schema;

const proSchema = schema({
    title: {
        type: String
    },
    price: {type:Number},
    image: {type:String},
    desc: {type:String},
    category: {type: mongoose.Schema.Types.ObjectId, ref:"Category"}
});


module.exports = mongoose.model('Product',proSchema);