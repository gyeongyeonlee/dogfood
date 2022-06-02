import React, { useEffect, useState } from 'react'
import axios from "axios"; 
import { Col, Card, Row, Divider, Collapse } from 'antd';
import Meta from 'antd/lib/card/Meta'
import ImageSlider from '../../utils/ImageSlider';
import { useSelector } from "react-redux";

const { Panel } = Collapse;


function RecommendPage() {

    const [Products, setProducts] = useState([]) //db에서 상품정보 가져오기
    const userId = localStorage.getItem('userId')
    useEffect(() => {

        let body = {
            userId: userId,
        }
        getProducts(body)

    }, [])

    const getProducts = (body) => {
        console.log(userId)
    axios.post('/api/product/recommend', body)
        .then(response => {
            if(response.data.success) {
                console.log(response.data.cosine_similarity)  
                setProducts(response.data.cosine_similarity)
            } else {
                alert("상품 가져오기 실패")
            }
        })
    }

    const renderCards = Products.map((product, index) =>{

    //lg 화면 가장 클때 6*4 /md 중간사이즈 8*3 /xs 가장작을때 24*1
    return (
        <Col lg={4} md={8} xs={24} key={index} >
    <Card

    cover={<a href={`/product/${product._id}`}> <ImageSlider images={product.images} /></a>  }
    >
    <Meta 
        title={product.title}
        description={`₩${product.price}`}

    />
    </Card>
    </Col>
    )  
    })

    return (
        <div>   
        <div style={{ width: '75%', margin: '3rem auto' }}>

        
        <Row gutter={[16,16]}>
        
            <h2>선호하는 상품들과 유사해요</h2>
            <h4>비슷한 평점을 가졌어요</h4>
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

export default RecommendPage