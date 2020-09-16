const mongoose = require('mongoose');
const schema = mongoose.Schema;

const cateSchema = schema({
    title: {
        type: String,
        min: [5,"Min 5 word!"],
        max: [30,"Max 30 word!"],
        required: [true, "Title is required!"]
    },
    products: [{type: mongoose.Schema.Types.ObjectId, ref:"Product"}]
});


module.exports = mongoose.model('Category',cateSchema);