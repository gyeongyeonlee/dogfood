const express = require('express');
const router = express.Router();
const multer = require('multer');
const { reset } = require('nodemon');
const { Product } = require('../models/Product');

//=================================
//             product
//=================================

var storage = multer.diskStorage({
    destination: function (req, file, cb) { //어디에 저장
      cb(null, 'uploads/') //모든 파일이 uploads에 
    },
    filename: function (req, file, cb) { 
      cb(null, `${Date.now()}_${file.originalname}`)
    }
  })
  
var upload = multer({ storage: storage }).single("file")

router.post('/image', (req,res) => { //프론트로부터 파일 전달받아서, 2.파일저장
    //가져온 이미지를 저장
    upload(req, res, (err) => {
        if(err) {
            return req.json({ success: false, err})
        } //두가지 전달
        return res.json({success: true, filePath: res.req.file.path , fileName: res.req.file.filename })
    }) 

})

router.post('/uploadProduct', (req,res) => { // ->/api/product
  //받아온 정보들 db에 넣어준다
  const product = new Product(req.body)

  product.save((err) => {
      if (err) return res.status(400).json({ success: false, err })
      return res.status(200).json({ success: true })
  })

});

router.post('/products', (req,res) => { // ->/api/product
// product collection에 들어있는 모든 상품정보 가져오기

  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm //검색창에 쓴 검색어 ex)"mexico"

  let findArgs = {};

  for(let key in req.body.filters) {
    if(req.body.filters[key].length > 0) { //한 개 이상 들어있으면
        
        console.log('key', key)

        if(key === "price") {
            findArgs[key] = {
                // price 값 처리하기 위해
                $gte: req.body.filters[key][0], //이것보다 크거나 같은
                $lte: req.body.filters[key][1] //이것보다 작거나 같은
            }

        } else {
            findArgs[key] = req.body.filters[key];
        }
    }
}

  //체크박스 선택시
  console.log('findArgs', findArgs) // findArgs { continents: [ 1, 2, 3 ] }

  if(term) { //검색어 찾기
     //product collection에 들어있는 모든 상품 정보 가져오기
    Product.find(findArgs) //{}조건
    .find({ $text: {$search: term} }) //Product 컬렉션 안에 있는 data중에서 {$search: term}과 일치하는 자료 가져옴 
    .populate("writer") //writer에 대한 모든 정보 가져올 수 있음
    .skip(skip) //
    .limit(limit)//  현재 8, 8개만 가져옴
    .exec((err, productInfo) => {
      if(err) return res.status(400).json({ success: false, err})
      return res.status(200).json({ 
        success: true, productInfo,
        postSize: productInfo.length
      })
    })

  }

    else {
        //product collection에 들어있는 모든 상품 정보 가져오기
      Product.find(findArgs) //{}조건
      .populate("writer") //writer에 대한 모든 정보 가져올 수 있음
      .skip(skip) //
      .limit(limit)//  현재 8, 8개만 가져옴
      .exec((err, productInfo) => {
        if(err) return res.status(400).json({ success: false, err})
        return res.status(200).json({ 
          success: true, productInfo,
          postSize: productInfo.length
        })
      })
      
    }
  


});
  
router.get('/products_by_id', (req,res) => { // ->/api/product
  
  //쿼리를 이용해서 가져옴 body말고 id,type 이용
  let type = req.query.type
  let productIds = req.query.id

  //id= 1111,222,33333 -> productIds = ['1111','222','3333'] 이런식으로 바꿔주기
  if(type === "array") {
    let ids = req.query.id.split(',')
    productIds = ids.map(item => {
      return item
    })
    //let productIds = req.query.id.split(','); 
  }

  //productId를 이용해서 db에서 productid 같은 상품의 정보 가져온다

  Product.find({ _id: { $in: productIds }})
  .populate('writer')
  .exec((err, product) => {
    if(err) return res.status(400).send(err)
    return res.status(200).send(product)
  })

});

 

module.exports = router;