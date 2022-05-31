
import React, { useEffect, useState } from 'react'
import axios from "axios"; 
import { Col, Card, Row, Tabs, Badge } from 'antd';
import Meta from 'antd/lib/card/Meta'
import ImageSlider from '../../utils/ImageSlider';
const { TabPane } = Tabs;



function RankingPage() {

    const [Products, setProducts] = useState([]) //db에서 상품정보 가져오기
    const [soldRank, setsoldRank] = useState(true)
    const [viewRank, setviewRank] = useState(false)

    useEffect(() => {

        let body = {
            sold: soldRank,
            view: viewRank
        }
        
        getProducts(body)
        
    }, [soldRank, viewRank])

    const getProducts = (body) => {
        axios.post('/api/product/rankingProduct', body)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data)  
                    if(response.data.sold){
                        setProducts(response.data.productInfo)
                    }
                    if(response.data.view){
                        setProducts(response.data.productInfo)
                    }
                
                } else {
                    alert("상품 가져오기 실패")
                }
            })
    }


    const renderCards = Products.map((product, index) =>{

        //lg 화면 가장 클때 6*4 /md 중간사이즈 8*3 /xs 가장작을때 24*1
        return <Col lg={6} md={8} xs={24} key={index} >

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


    const onChange = (key) => {
    //   /  console.log(key);
        if(key==="1"){
            return setsoldRank(true), setviewRank(false)
        }
        if(key==="2"){
            return setsoldRank(false), setviewRank(true)
        }
      };


  return (
    <div style={{ width: '75%', margin: '3rem auto' }}>
    <Tabs
 
    size="large"
    //type="card"
        defaultActiveKey="1"
        style={{
          marginBottom: 32,
        }}
        onChange={onChange}
        destroyInactiveTabPane={true}
        centered>
        <TabPane tab="판매순" key="1" 
            forceRender={true}>
            <Row gutter={[16,16]}>

                {renderCards}
                </Row>
        </TabPane>


        <TabPane tab="클릭순" key="2" 
            forceRender={true}>
            <Row gutter={[16,16]}>
                {renderCards}
                </Row>
        </TabPane>


      </Tabs>

      
    </div>
  )
}

export default RankingPage