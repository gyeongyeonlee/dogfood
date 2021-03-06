const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require("../models/Product");
const { Payment } = require("../models/Payment");
const { Review } = require("../models/Review");


const { auth } = require("../middleware/auth");

// const { admin } = require("../middleware/admin");

const async = require('async');

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        id: req.user.id,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history,

    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ id: req.body.id }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, id not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});


router.post("/addToCart", auth, (req, res) => {
    //1. User collection ?????? ?????? ????????? ?????? ????????????
    // console.log(req.user)
    User.findOne({_id: req.user._id},
    (err, userInfo) => {

         //2. ????????? ???????????? ????????? ????????? ?????? ????????? ?????? ?????? ????????? ??????
        
        let duplicate = false;
        userInfo.cart.forEach((item) => {
            if(item.id === req.body.productId){
                duplicate = true;
            }
        })

            //????????? ?????? ?????? ???, ????????????quantity??? 1??????

        if (duplicate) {
            User.findOneAndUpdate( //user ??????, cart?????? ?????? ?????? ??????
                {_id: req.user._id, "cart.id": req.body.productId},
                //increment 1 ??????
                {$inc: {"cart.$.quantity": 1}},
                {new: true}, //?????? ?????????, update??? ?????????UserInfo ??????????????? ???????????????
                (err, userInfo) => {
                    if(err) res.status(400).json({ success: false, err})
                    res.status(200).send(userInfo.cart)
                }
            )
        } 

            //????????? ?????? ?????? ???, ?????? ??????

        else {
            User.findOneAndUpdate(
                {_id: req.user._id},
                {
                    $push: {
                        cart: {
                            id: req.body.productId,
                            quantity: 1,
                            date: Date.now()
                        }
                    }
                },
                {new: true},
                (err, userInfo) => {
                    if(err) res.status(400).json({ success: false, err})
                    res.status(200).send(userInfo.cart)
                }
            )
        }


    })
});


router.get('/removeFromCart', auth, (req, res) => {

    //?????? cart?????? ?????? ???????????? ??? ????????? ???????????? 
    User.findOneAndUpdate(
        { _id: req.user._id },
        { //?????????
            "$pull":
                { "cart": { "id": req.query.id } }
        },
        { new: true },
        (err, userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map(item => {
                return item.id
            })

            //product collection??????  ?????? ???????????? ???????????? ????????? ???????????? 

            Product.find({ _id: { $in: array } })
                .populate('writer')
                .exec((err, productInfo) => {
                    return res.status(200).json({
                        productInfo,
                        cart
                    })
                })
        }
    )
})

router.post('/successBuy', auth, (req, res) => {
    //1. User Collection ?????? History ?????? ?????? ????????? ?????? ?????? ????????????
    let history = [];
    let transactionData = {};


    let pro = [];
    req.body.cartDetail.forEach((item) => {
        req.body.cartDetail.forEach((item) => {
            history.push({
                dateOfPurchase: Date.now(),
                name: item.title,
                id: item._id,
                price: item.price,
                quantity: item.quantity,
                //paymentId: req.body.paymentData.paymentID
            })
        })
    })

    //     pro.push({
            
    //             name: item.title,
    //              id: item._id,
    //              price: item.price,
    //              quantity: item.quantity
           
    //     })        
        
    // })
    //     history.push({
    //         dateOfPurchase: Date.now(), //????????????
    //         product: pro,//?????? ??????
    //         //paymentId: req.body.paymentData.paymentID //CartPage??? paymentData?????? ?????????
    //     })


    // console.log(pro)
    



    //2. Payment Collection ?????? ????????? ?????? ????????? ?????????
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }

    transactionData.data = req.body.paymentData
    transactionData.product = history

    //????????? ??? ?????????
    //history ?????? ??????
    User.findOneAndUpdate(
        {_id: req.user._id},
        { $push: { history: history }, $set: { cart: [] }},
        { new: true },
        (err, user) => {
            if(err) return res.json({success: false, err})

            //payment ????????? transactionData?????? ??????
            const payment = new Payment(transactionData)
            payment.save((err, doc) => {
                if(err) return res.json({ success: false, err })
            

            //3. Product Collection ?????? ?????? sold ?????? ?????? ???????????? ????????????

            // ?????? ??? ????????? quantity??? ?????????

            let products = [];
            doc.product.forEach(item => {
                products.push({ id: item.id, quantity: item.quantity })
            })

            async.eachSeries(products, (item, callback) => {
                Product.update(
                    { _id: item.id },
                    {
                        //sold ?????? update
                        $inc: {
                            "sold" : item.quantity
                        }
                    },
                    {
                        //update ??? ??? front??? ??????????????? (true)
                        //?????? ???????????? (false)
                        new: false},
                        callback
                )
            }, (err) => {
                if(err) return res.status(400).json({ success: false,err })
                res.status(200).json({
                    success: true,
                    cart: user.cart,
                    cartDetail: []
                })
            }      
            )

        })
        }
    )    
})


//HistoryPage?????? ?????? ??????
router.post('/uploadReview', (req,res) => { 
    //????????? ????????? db??? ????????????
    const review = new Review(req.body)

    const txtHeader = ['review'];
    const csvWriterHeader = txtHeader.map((el) => {
      return {id: el, title: el};
    });
  
    const arr = [];
    arr.push({
        review: review['content']
      });
  
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    const csvWriter = createCsvWriter({
      path: 'new_review_predict_result.csv',
      header: csvWriterHeader,
    });
  
    csvWriter.writeRecords(arr).then(()=> {
      console.log('done!');
    });
  
    const spawn = require('child_process').spawn;
    const model = spawn('python', ['new_review_predict.py', 'total_review_revised.csv', 'new_review_predict_result.csv']);
  
    model.stdout.on('data', function(data){
        review.save((err) => {
            if (err) return res.status(400).json({ success: false, err })
            return res.status(200).json({ 
                predict: data.toString(),
                success: true })
        })
    })

    model.stderr.on('data', function(data){
        console.log(data.toString());
    })
  });


// //HistoryPage?????? Review ??????
// router.get('/reviewList', async (req,res) => { 
//     //????????? ????????? db??? ????????????
//     console.log('????????????:', req.query.id)
//     const reviews = await Review.find({ author: { $in: req.query.id }})
//     // console.log(reviews)
//     res.status(200).send({
//         reviews: reviews
//       })
//   });


  // ?????? ?????? ????????????
  router.post('/getuser', async (req,res) => {   
    const user = await User.find().where('_id').equals(req.body.userId)
    res.status(200).send({
        success: true,
        dog_breed: user[0].dog_breed
      })
    });

module.exports = router;