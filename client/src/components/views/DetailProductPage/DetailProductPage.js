import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
import ProductReview from './Sections/ProductReview';
import { Row, Col, Divider, Pagination, Card} from 'antd';
import "antd/dist/antd.css";
import {Button} from 'antd';
import { useDispatch } from 'react-redux';
import Meta from 'antd/lib/card/Meta'
import ImageSlider from '../../utils/ImageSlider';



import product from '../../../images/product.jpg'


function DetailProductPage(props) {

    const [loadings, setLoadings] = useState([]);

    const enterLoading = (index) => {
        axios.get(`/api/product/review_predict?id=${productId}&type=single`)
        .then(response => {
            
            setResult(response.data.result)           
        })
        
        .catch(err => alert(err))
        setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = true;
        return newLoadings;
        });
        setTimeout(() => {
        setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = false;
            return newLoadings;
        });
        }, 6000);

    };


    
    const productId = props.match.params.productId

    const [Product, setProduct] = useState({})
    const [Review, setReview] = useState([])
    const [result, setResult] = useState()
    const [Similar, setSimilar] = useState([])
    const [Hashtag, setHashtag] = useState([])

    const dispatch = useDispatch()

    const clickHandler = () => {
        axios.get(`/api/product/review_predict?id=${productId}&type=single`)
        .then(response => {
            setResult(response.data.result)           
        })
        
        .catch(err => alert(err))
    }


    useEffect(()=>{


        axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
        .then(response => {
            console.log("상품리뷰:",response.data.reviews)
            setProduct(response.data.products[0]) //product 정보 Product에 들어감
            setReview(response.data.reviews)
            setSimilar(response.data.similarity)
            setHashtag(response.data.hashtag)
            console.log("해쉬태그 결과:",response.data.hashtag)
        })
        
        .catch(err => alert(err))
    }, [])


    const pageSize = 5;
    console.log("review", Review)
    let [State, setState] = useState({
        data: Review,
        totalPage: Review.length / pageSize, //2
        minIndex: 0,
        maxIndex: pageSize,
        current: 1,
      });


    const handleChange = (page) => {
        setState({
          current: page,
          minIndex: (page - 1) * pageSize,
          maxIndex: page * pageSize
        });
      };
    
      const renderCards = Similar.map((product, index) =>{

        //lg 화면 가장 클때 6*4 /md 중간사이즈 8*3 /xs 가장작을때 24*1
        return <Col lg={6} md={12} xs={24} key={index} >

                <Card 
                //product/productid로 링크생성
                cover={<a href={`/product/${product._id}`}>
                    <ImageSlider images={product.images} /></a>  }
                >
                <Meta 
                    title={product.title}
                    description={`₩${product.price}`}


                />
                </Card>


        </Col>
        
       

    })



    return (
        //, paddingLeft: '150px', paddingRight: '150px' 
    <div style={{ width: '100%', padding: '3rem 4rem'}}>
        {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
            <h1>{Product.title}</h1>
        </div>
        <br /> */}
        <br />

        <Row gutter={[16, 16]} >
            <Col lg={{ span: 6, offset: 4 }} sm={24}> 

                {/* productImage */}
                <ProductImage detail={Product}/>
            </Col>
            
            <Col lg={{ span: 8, offset: 2 }} sm={24}> 

                {/* productInfo */}
                <ProductInfo detail={Product} />

            </Col>
        </Row>


        <br />
        <br />
        {/* <Divider></Divider> */}
        {/* 상품정보,설명 */}
       
        <Row gutter={[16, 16]} >

            <Col lg={{ span: 16, offset: 8 }} sm={{span: 16, offset: 3 }}> 
                {/* <p className="image">
                    <img src={product} alt="상품설명" ></img>
                </p> */}
 
            </Col>

        </Row>
   


        {/* 리뷰 */}
        <br></br>
        <Row gutter={[16, 16]}>
            <Col lg={{ span: 16, offset: 4 }} sm={24}> 
            <Divider orientation="left">
            <Button size='large' shape="" onClick={() => enterLoading(0)} loading={loadings[0]}>
                딥러닝을 통한 리뷰 분석 보기
            </Button></Divider>
            <b><font face="나눔고딕">{result}</font></b><br></br><br></br>
            <Divider orientation="left">다른 사람들은 이렇게 평가했어요</Divider>
                {Hashtag.map((hashtag, index) => {
                    return (
                    <Button size='default' shape="round">
                        #  {hashtag}
                    </Button>
                    )
                })}<br></br>
            <Divider orientation="left">유사한 상품</Divider>
            <Row gutter={[16,16]}>
                {renderCards}
                </Row>
            <Divider orientation="left">구매 후기</Divider>
            {/* productReview */}
            {/* 5개씩 나타나게 */}
             
            {Review.map((review, index) => {
            return (
                index >= State.minIndex &&  index < State.maxIndex &&
                <ProductReview key={index} detail={review} />
            )

        })}

            <Pagination defaultCurrent={1}
             pageSize={pageSize}
             current={State.current}
             total={Review.length}
             onChange={handleChange}
             style={{ bottom: "0px" }}
            />
         </Col>


        </Row>

    </div>
  )
}

export default DetailProductPage