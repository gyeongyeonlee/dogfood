import React from 'react'
import {Button, Descriptions} from 'antd';
import { useDispatch } from 'react-redux';
import {addToCart} from '../../../../_actions/user_actions';
import { Brands,  Ages, Functions } from '../../UploadProductPage/UploadProductPage' 

function ProductInfo(props) {

    const dispatch = useDispatch()

    const clickHandler = () => {
        //필요한 정보를 Cart 필드에 넣어준다
        dispatch(addToCart(props.detail._id))
    }

    let fun = "";

    const brand = Brands.map((item) => {
        
        if( item.key === parseInt(props.detail.brand) ){
            //console.log(item.key)
            return item.value
        }
    })

    const age = Ages.map((item) => {
        
        if( item.key === parseInt(props.detail.age) ){
            return item.value
        }
    })

   
    Functions.map((item) => {

        for(let i in props.detail.function) {
            if(item.key === parseInt(props.detail.function[i])) {
                fun += item.value + " "
            }
        }
        
    })
    // console.log(props.detail)




  return (
    <div> 
        <Descriptions title={props.detail.title} bordered> 
            <Descriptions.Item label="가격"  span={2}>{props.detail.price}</Descriptions.Item>
            <Descriptions.Item label="브랜드" span={2}>{brand}</Descriptions.Item>
            <Descriptions.Item label="기능" span={4}>{fun}</Descriptions.Item>
            <Descriptions.Item label="급여대상" span={4}>{age}</Descriptions.Item>
            <Descriptions.Item label="주원료" span={4}>{props.detail.description}</Descriptions.Item>
        </Descriptions>
            <br />

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button size='large' shape="round"  onClick={clickHandler}>
                    구매하기
                </Button>
                
                
                
            </div>
            


    </div>
  )
}

export default ProductInfo