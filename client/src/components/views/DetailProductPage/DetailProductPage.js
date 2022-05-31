import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
import ProductReview from './Sections/ProductReview';
import { Row, Col, Divider, Pagination} from 'antd';
import "antd/dist/antd.css";
import {Button} from 'antd';
import { useDispatch } from 'react-redux';

import product from '../../../images/product.jpg'

// import * as tf from '@tensorflow/tfjs';

// (async () => {
//     const model = await tf.loadLayersModel('https://cdn.glitch.global/d6851aff-53c5-4e67-aa5a-663291f9b837/model.json?v=1653844242379');
// })();



function DetailProductPage(props) {

    
    const productId = props.match.params.productId

    const [Product, setProduct] = useState({})
    const [Review, setReview] = useState([])
    const [result, setResult] = useState()

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
            console.log("결과:",response.data.similarity)
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

        <Row gutter={[16, 16]}>
            <Col lg={{ span: 16, offset: 4 }} sm={24}> 
            <Divider orientation="left">유사한 상품</Divider>

            <Divider orientation="left">구매 후기</Divider>
            <Button size='default' shape="round" onClick={clickHandler}>
                리뷰 분석
            </Button>&nbsp;&nbsp;&nbsp;
            <b>{result}</b>
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