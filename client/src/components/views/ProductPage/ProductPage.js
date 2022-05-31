import React, { useEffect, useState } from 'react'
import axios from "axios"; 
import { Col, Card, Row, Carousel,Collapse } from 'antd';
import Meta from 'antd/lib/card/Meta'
import ImageSlider from '../../utils/ImageSlider';
import Checkbox from './Sections/CheckBox';
import Radiobox from './Sections/RadioBox';
import SearchFeature from './Sections/SearchFeature';
import { brand, age, price } from './Sections/Datas';
const { Panel } = Collapse;

function ProductPage() {

    const [Products, setProducts] = useState([]) //db에서 상품정보 가져오기
    const [Skip, setSkip] = useState(0) 
    const [Limit, setLimit] = useState(12)
    const [PostSize, setPostSize] = useState(0)
    const [Filters, setFilters] = useState({
        brand: [],
        age: [],
        function: []
    })
    const [SearchTerm, setSearchTerm] = useState("")




    useEffect(() => {

        let body = {
            skip: Skip, //처음부터
            limit: Limit //8개까지
        }
        
        getProducts(body)
        
    }, [])

    const getProducts = (body) => {
        axios.post('/api/product/products', body)
            .then(response => {
                if(response.data.success) {
                    //console.log(response.data)  
                    if(body.loadMore) { //8개 가져오고 그뒤에 또 가져옴
                        setProducts([...Products,...response.data.productInfo]) //전체 products에다가 추가
                    } else{
                        setProducts(response.data.productInfo)
                    }                  
                    setPostSize(response.data.postSize)
                } else {
                    alert("상품 가져오기 실패")
                }
            })
    }


    const loadMoreHandler = () => {
        
        let skip = Skip + Limit


        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }

        getProducts(body)
        setSkip(skip)
    }
    const renderCards = Products.map((product, index) =>{
        // console.log('product', product)
        // console.log('product', index)

        //lg 화면 가장 클때 6*4 /md 중간사이즈 8*3 /xs 가장작을때 24*1
        return <Col lg={4} md={8} xs={24} key={index} >
         <Card
//product/productid로 링크생성
        cover={<a href={`/product/${product._id}`}> <ImageSlider images={product.images} /></a>  }
        >
        <Meta 
            title={product.title}
            description={`₩${product.price}`}
        />
        </Card>
        </Col>
        
       

    })


    const showFilterResults = (filters) => {
        let body = {
            skip: 0,
            limit: Limit,
            filters: filters
        }
        getProducts(body)
        setSkip(0)
    }

    
    const handlePrice = (value) => {
        const data = price; //price 정보
        let array = [];

        for(let key in data) {
            if(data[key]._id === parseInt(value,10)) {
                array = data[key].array;
            }
        }
        return array;
    }


    const handleFilters = (filters, category) => { 
        const newFilters = { ...Filters }
        newFilters[category] = filters //checkbox에서 1,2,3 선택시 여기로 들어옴, Filter - continents: [1,2,3]로 
        console.log(newFilters)

        if (category === "price") {
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues 
        }


        showFilterResults(newFilters)
        setFilters(newFilters)
    }

    const updateSearchTerm = (newSearchTerm) => {
        setSearchTerm(newSearchTerm) //searchFeature에서 있던값 update

        let body = {
            skip: 0, //db처음부터 긁어옴
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm

        }

        setSkip(0)
        setSearchTerm(newSearchTerm)
        getProducts(body)
    }

    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>

            { /*Filter */}

            <Row gutter={[16, 16]}>
            {/* <Card size="small" title="브랜드" 
                headStyle={{ backgroundColor: "#F7F2E0"}}  defaultActiveKey={['0']} >
                    
                        <Checkbox list={brand}
                        handleFilters={filters => handleFilters(filters, "brand")}/>            
                    
                </Card> */}
                {/* key=123/111 */}
                <Collapse defaultActiveKey={['0']} accordion>
                    <Panel header="브랜드" key="1" >
                        <Checkbox list={brand}
                        handleFilters={filters => handleFilters(filters, "brand")}/>            
                    </Panel>

                    <Panel header="급여대상" key="1">
                        <Checkbox list={age}
                        handleFilters={filters => handleFilters(filters, "age")}/>            
                    </Panel>

                    <Panel header="가격" key="1">
                        <Radiobox list={price}
                        handleFilters={filters => handleFilters(filters, "price")}/>          
                    </Panel>
                </Collapse>
            </Row>

                

            {/* flex_end */}
            { /*Search */}
            <div style={{ 
                display: 'flex',
                justifyContent: 'right',
                margin: '1rem auto'}}>
                <SearchFeature 
                    refreshFunction={updateSearchTerm}
                
                />
            </div>
            

            { /*Cards */}

            
            <Row gutter={[16,16]}>
            {renderCards}


            </Row>

            <br />

            {PostSize >= Limit &&  // postsize가 limit보다 클 때 더보기란
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={loadMoreHandler}>더보기</button>
                </div>            
            }
        </div>
    )
}

export default ProductPage