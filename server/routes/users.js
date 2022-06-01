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
    //1. User collection 에서 해당 유저의 정보 가져오기
    // console.log(req.user)
    User.findOne({_id: req.user._id},
    (err, userInfo) => {

         //2. 가져온 정보에서 카트에 넣으려 하는 상품이 이미 들어 있는지 확인
        
        let duplicate = false;
        userInfo.cart.forEach((item) => {
            if(item.id === req.body.productId){
                duplicate = true;
            }
        })

            //상품이 이미 있을 때, 상품개수quantity만 1추가

        if (duplicate) {
            User.findOneAndUpdate( //user 찾고, cart안에 있는 상품 찾음
                {_id: req.user._id, "cart.id": req.body.productId},
                //increment 1 추가
                {$inc: {"cart.$.quantity": 1}},
                {new: true}, //받은 결과값, update된 결과값UserInfo 받기위해서 해야할설정
                (err, userInfo) => {
                    if(err) res.status(400).json({ success: false, err})
                    res.status(200).send(userInfo.cart)
                }
            )
        } 

            //상품이 있지 않을 때, 새로 추가

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

    //먼저 cart안에 내가 지우려고 한 상품을 지워주기 
    User.findOneAndUpdate(
        { _id: req.user._id },
        { //지울때
            "$pull":
                { "cart": { "id": req.query.id } }
        },
        { new: true },
        (err, userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map(item => {
                return item.id
            })

            //product collection에서  현재 남아있는 상품들의 정보를 가져오기 

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
    //1. User Collection 안에 History 필드 안에 간단한 결제 정보 넣어주기
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
    //         dateOfPurchase: Date.now(), //주문번호
    //         product: pro,//상품 배열
    //         //paymentId: req.body.paymentData.paymentID //CartPage의 paymentData에서 가져옴
    //     })


    // console.log(pro)
    



    //2. Payment Collection 안에 자세한 결제 정보를 넣어줌
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }

    transactionData.data = req.body.paymentData
    transactionData.product = history

    //모아둔 걸 넣어줌
    //history 정보 저장
    User.findOneAndUpdate(
        {_id: req.user._id},
        { $push: { history: history }, $set: { cart: [] }},
        { new: true },
        (err, user) => {
            if(err) return res.json({success: false, err})

            //payment 에다가 transactionData정보 저장
            const payment = new Payment(transactionData)
            payment.save((err, doc) => {
                if(err) return res.json({ success: false, err })
            

            //3. Product Collection 안에 있는 sold 필드 정보 업데이트 시켜주기

            // 상품 당 몇개의 quantity를 샀는지

            let products = [];
            doc.product.forEach(item => {
                products.push({ id: item.id, quantity: item.quantity })
            })

            async.eachSeries(products, (item, callback) => {
                Product.update(
                    { _id: item.id },
                    {
                        //sold 부분 update
                        $inc: {
                            "sold" : item.quantity
                        }
                    },
                    {
                        //update 된 걸 front로 보내줘야함 (true)
                        //이건 안보내줌 (false)
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


//HistoryPage에서 Review
router.post('/uploadReview', (req,res) => { 
    //받아온 정보들 db에 넣어준다
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
    const model = spawn('python', ['new_review_predict.py', 'total_review.csv', 'new_review_predict_result.csv']);
  
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


module.exports = router;