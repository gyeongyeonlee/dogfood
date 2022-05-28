const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const reviewSchema = mongoose.Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    rate: {
        type: Number
    },
    content: {
        type: String,
        maxlength: 500
    }
}, {timestamps: true })




const Review = mongoose.model('Review', reviewSchema);

module.exports = { Review }