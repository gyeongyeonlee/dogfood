const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require("moment");

const userSchema = mongoose.Schema({
    //ID, PW, 이름, 이메일, 주소, 핸폰
    
    //ID
    id: {
        type: String,
        trim:true, 
        minglength: 5,
        unique: 1 // 한개만 가능
    },
    //PW
    password: {
        type: String,
        minglength: 6
    },
    //이름
    name: {
        type:String,
        maxlength:50
    },
    //이메일
    email: {
        type:String,
        trim:true, //공백x
        unique: 1 
    },
    //주소
    address: {
        type:String,
        maxlength:200
    },
    //핸폰
    phone: {
        type:String,
        trim:true,
    },   
    // 강아지 견종
    dog_breed: {
        type:Number
    }, 
    // 강아지 체중 
    dog_weight: {
        type:Number
    },
    // 강아지 연령
    dog_age: {
        type:Number
    },
    role : { // 넘버가 1이면 관리자/ 0이면 일반유저
        type:Number,
        default: 0
    },
    image: String,
    token : { // -> 유효성 관리
        type: String,
    },
    tokenExp :{ // 토큰 사용 기간 
        type: Number
    },
    cart: {
        type: Array,
        default: []
    },
    history: {
        type: Array,
        default: []
    }
    
})


userSchema.pre('save', function( next ) {
    var user = this;
    
    if(user.isModified('password')){    
        // console.log('password changed')
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err);
    
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                user.password = hash 
                next()
            })
        })
    } else {
        next()
    }
});

userSchema.methods.comparePassword = function(plainPassword,cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if (err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    console.log('user',user)
    console.log('userSchema', userSchema)
    var token =  jwt.sign(user._id.toHexString(),'secret')
    var oneHour = moment().add(1, 'hour').valueOf();

    user.tokenExp = oneHour;
    user.token = token;
    user.save(function (err, user){
        if(err) return cb(err)
        cb(null, user);
    })
}

userSchema.statics.findByToken = function (token, cb) {
    var user = this;

    jwt.verify(token,'secret',function(err, decode){
        user.findOne({"_id":decode, "token":token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);
        })
    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User }