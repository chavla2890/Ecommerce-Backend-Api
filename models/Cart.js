const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const cartSchema = mongoose.Schema({
    owner:{
        type: ObjectId,
        ref: 'User',
        required: true
    },
    items:[{
        itemId : {
            type: ObjectId,
            ref:"Item",
            required: true
        },
        name: String,
        quantity:{
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        price: Number
    }],
    bill: {
        type: Number,
        required: true,
        default: 0
    }
},{timeStamp: true})

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart