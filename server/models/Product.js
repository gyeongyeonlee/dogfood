const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moment = require("moment");

const productSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    review: {
        type: Schema.Types.ObjectId,
        ref: 'Review'
    },
    title: {
        type: String,
        maxlength: 50
    },
    price: {
        type: Number,
    },
    description: {
        type: String
    },    
    images: {
        type: Array, //여러개 들어갈 수 있기떄문
        default: []
    },
    brand: {
        type: Number
    },
    age: {
        type: Number
    },
    function: {
        // type: String
        type: Array,
        default: []
    },
    sold: { // 몇 개가 팔렸는지 확인
        type: Number,
        maxlength: 100,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    }   
}, {timestamps: true })

productSchema.index({
    title: 'text'
}, {
    weights: {
        title: 5
    }
})



const Product = mongoose.model('Product', productSchema);

module.exports = { Product }