import React, { useEffect, useState } from 'react'
import axios from "axios"; 
import { Col, Card, Row, Carousel, Collapse } from 'antd';
import Meta from 'antd/lib/card/Meta'
import ImageSlider from '../../utils/ImageSlider';

import main1 from '../../../images/main1.jpg'
import main2 from '../../../images/main2.jpg'
import main3 from '../../../images/main3.jpg'

const { Panel } = Collapse;


function LandingPage() {


const images = [main1, main2, main3]
const [Products, setProducts] = useState([]) //db에서 상품정보 가져오기

useEffect(() => {

  
  getProducts()
  
}, [])

const getProducts = () => {
  axios.post('/api/product/new_product', )
      .then(response => {
          if(response.data.success) {
              //console.log(response.data)  
                setProducts(response.data.productInfo)

          } else {
              alert("상품 가져오기 실패")
          }
      })
}

const renderCards = Products.map((product, index) =>{

  //lg 화면 가장 클때 6*4 /md 중간사이즈 8*3 /xs 가장작을때 24*1
  return   <Col lg={4} md={8} xs={24} key={index} >
   <Card

  cover={<a href={`/product/${product._id}`}> <ImageSlider images={product.images} /></a>  }
  >
  <Meta 
      title={product.title}
      description={`₩${product.price}`}

  />
  </Card>
  </Col>
})

  return (
    <div>   
      <Carousel autoplay>
            {images.map((image, index) => (
                <div key={index} > 
                
                    <img style={{ width: '100%', maxHeight: '400px'}}
                    src={ image } />

                </div>
            ))}
      </Carousel>
      

      <br/>
      <br/>
      <br/>
      <br/><br/>
  
      <div style={{ width: '75%', margin: '3rem auto' }}>

      
      <Row gutter={[16,16]}>
        <h2>새로운 상품이 나왔어요</h2>
      {/* <Carousel autoplay> */}
          {/* <Collapse collapsible={"disabled"} defaultActiveKey={['1']} bordered={false} ghost={true}>
            <Panel header="신상품" key="1" >
              

                  {renderCards}


                
                  </Panel>
          </Collapse> */}
           {renderCards}
      </Row>
      {/* </Carousel> */} 
      </div>
    </div>
  )
}

export default LandingPage