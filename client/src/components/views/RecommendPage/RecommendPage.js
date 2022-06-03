import React, { useEffect, useState } from 'react'
import axios from "axios"; 
import { Col, Card, Row, Divider, Collapse } from 'antd';
import Meta from 'antd/lib/card/Meta'
import ImageSlider from '../../utils/ImageSlider';
import { useSelector } from "react-redux";

const { Panel } = Collapse;


function RecommendPage() {
    const [Products, setProducts] = useState([]) //db에서 상품정보 가져오기
    const [User, setUser] = useState()
    const userId = localStorage.getItem('userId')
    useEffect(() => {

        let body = {
            userId: userId,
        }

        getProducts(body)
        // getUser(body)

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


    const getUser = (body) => {
        axios.post('/api/users/getuser', body)
        .then(response => {
            if(response.data.success) {
                setUser(response.data.dog_breed)
            } else {
                alert("유저 가져오기 실패")
            }
        })
    }


    if (User == '1') {
        setUser('말티즈')
    }else if(User == '2'){
        setUser('웰시코기')
    }else if(User == '2'){
        setUser('포메라니안')
    }else if(User == '3'){
        setUser('시바견')
    }else if(User == '4'){
        setUser('치와와')
    }else if(User == '5'){
        setUser('리트리버')
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

    const renderCards2 = Products.map((product, index) =>{

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
        <Divider orientation="left"><h2>선호하는 제품과 비슷한 평점을 가졌어요</h2></Divider>
            {renderCards}

        </Row>
        
        </div>
        </div>
    )
}

export default RecommendPage