import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
import ProductReview from './Sections/ProductReview';
import { Row, Col, Divider, Pagination} from 'antd';
import "antd/dist/antd.css";

import product from '../../../images/product.jpg'

function DetailProductPage(props) {

    
    const productId = props.match.params.productId

    const [Product, setProduct] = useState({})
    const [Review, setReview] = useState([])



    useEffect(()=>{


        axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
        .then(response => {
            setProduct(response.data[0]) //product 정보 Product에 들어감
            setReview(response.data[0]['review'])
            /*
            if(response.data.success) {
                if(response.data.success){
                    console.log("response.data", response.data)
                    setProduct(response.data.product[0]) //product 정보 Product에 들어감
                } else {
                    alert("상세정보 가져오기 실패")
                }
            }
            */
        })
        
        .catch(err => alert(err))
    }, [])


    const pageSize = 5;
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