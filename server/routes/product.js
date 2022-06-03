const express = require('express');
const router = express.Router();
const multer = require('multer');
const { reset } = require('nodemon');
const { Product } = require('../models/Product');
const { Review } = require('../models/Review');

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
  
router.get('/products_by_id', async (req,res) => { // ->/api/product
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
  const products = await Product.find({ _id: { $in: productIds }})
  const reviews = await Review.find({ product: { $in: productIds }}).populate('author')
  console.log("상품:",products[0]['title'])
  const spawn = require('child_process').spawn;
  const model = spawn('python', ['TF-IDF.py', 'products.csv', products[0]['title']]);

  model.stdout.on('data', async function(data){ 
    const similar_product = data.toString().split(',')
    similar_product[3] = similar_product[3].trim()

    const similar_list = await Product.find().where('title').in(similar_product)
    const model = spawn('python', ['word_frequency.py', 'csv-writer.csv']);

    model.stdout.on('data', async function(data){
      const hashtag = data.toString().split(',')
      hashtag[9] = hashtag[9].trim()

      res.status(200).send({
        products: products,
        reviews: reviews,
        similarity: similar_list,
        hashtag: hashtag
      })
    })
  })

  model.stderr.on('data', function(data){
    console.log(data.toString());
  })
  
});

router.get('/review_predict', async (req,res) => { // ->/api/product
  let productIds = req.query.id
  console.log(productIds)
  const reviews = await Review.find({ product: { $in: productIds }}).populate('author')
  const txtHeader = ['rate', 'review'];
  const csvWriterHeader = txtHeader.map((el) => {
    return {id: el, title: el};
  });

  const arr = [];
  for (var i = 0; i <reviews.length; i++){
    arr.push({
      rate: reviews[i]['rate'],
      review: reviews[i]['content']
    });
  }

  const createCsvWriter = require('csv-writer').createObjectCsvWriter;
  const csvWriter = createCsvWriter({
    path: 'csv-writer.csv',
    header: csvWriterHeader,
  });

  csvWriter.writeRecords(arr).then(()=> {
    console.log('done!');
  });

  const spawn = require('child_process').spawn;
  const model = spawn('python', ['review_predict.py', 'csv-writer.csv']);

  model.stdout.on('data', function(data){    
    res.status(200).send({
      result: data.toString()
    })
  })

  model.stderr.on('data', function(data){
    console.log(data.toString());
  })
  
});


//랭킹 
router.post('/rankingProduct', (req,res) => {   
     
  if(req.body.sold){
    Product.find().sort({"sold":-1}).limit(12)  
    .exec((err, productInfo) => {
      if(err) return res.status(400).json({ success: false, err})
      return res.status(200).json({ 
        success: true, 
        productInfo,
        sold: true,
      })
    })

  }
  if(req.body.view){
    console.log(req.body.view)
    Product.find().sort({"views":-1}).limit(12)    
    .exec((err, productInfo) => {
      if(err) return res.status(400).json({ success: false, err})
      return res.status(200).json({ 
        success: true, 
        productInfo,
        view: true,
      })
    })
  }
  
});

//메인페이지 - 신상품
router.post('/new_product', (req,res) => {   
     
  if(req.body) {
    Product.find().sort({'_id':-1}).limit(6)
    .exec((err, productInfo) => {
      if(err) return res.status(400).json({ success: false, err})
      return res.status(200).json({ 
        success: true, 
        productInfo
  
      })
    })
  }
  
  });

  router.post('/recommend', async (req,res) => { // ->/api/product
  
    // 관리자 아이디 제외한 리뷰들 가져오기
    const reviews = await Review.find({ author: { $nin: '6291e50b2940193b4089a209' }})

    // 가장 높은 별점을 준 상품 가져오기
    // const highRate = await Review.find({ author: { $in: req.body.userId }})
    const highRate = await Review.find().where('author').equals(req.body.userId).sort('-rate')

    const txtHeader = ['author', 'product', 'rate'];
    const csvWriterHeader = txtHeader.map((el) => {
      return {id: el, title: el};
    });

    const arr = [];
    for (var i = 0; i <reviews.length; i++){
      arr.push({
        author: reviews[i]['author'],
        product: reviews[i]['product'],
        rate: reviews[i]['rate']
      });
    }

    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    const csvWriter = createCsvWriter({
      path: 'cosine.csv',
      header: csvWriterHeader,
    });

    csvWriter.writeRecords(arr).then(()=> {
      console.log('done!');
    });

    const spawn = require('child_process').spawn;
    const model = spawn('python', ['cosine_similarity.py', 'cosine.csv', highRate[0].product]);
  
    model.stdout.on('data', async function(data){ 
      const cosine_list = data.toString().split(',')
      cosine_list[4] = cosine_list[4].trim()
  
      const cosine_similar_list = await Product.find().where('_id').in(cosine_list)
      
      res.status(200).send({
        success: true,
        cosine_similarity: cosine_similar_list, 
      })
    })
  
    model.stderr.on('data', function(data){
      console.log(data.toString());
    })
    
  });

module.exports = router;