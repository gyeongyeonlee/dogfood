//import { response } from 'express';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getCartItems, removeCartItem, onSuccessBuy } from '../../../_actions/user_actions'
import UserCardBlock from './Sections/UserCardBlock';
import { Empty, Row , Col, Result, Button } from 'antd';

function CartPage(props) {

    const dispatch = useDispatch();

    const [Total, setTotal] = useState(0)
    const [ShowTotal, setShowTotal] = useState(false)
    const [ShowSuccess, setShowSuccess] = useState(false)


    useEffect(() => {

        let cartItems = []

        // 리덕스 user state 안에 cart 안에 상품이 있는지 확인
        if(props.user.userData && props.user.userData.cart) {
            if(props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id)
                })
                dispatch(getCartItems(cartItems, props.user.userData.cart))
                    .then(response => { calculateTotal(response.payload) })
              }
              

        }

    }, [props.user.userData])


    let calculateTotal = (cartDetail) => {
        let total = 0;

        cartDetail.map(item => {
            total += parseInt(item.price,10) * item.quantity
        })

        setTotal(total)
        setShowTotal(true)
        
    }

    let removeFromCart = (productId) => {

        dispatch(removeCartItem(productId))
            .then(response => {
                if (response.payload.productInfo.length <= 0) { // 상품이 없으면
                    setShowTotal(false)
                }

        })

    }

     /////////////////////// 구매 

     const transactionSuccess = (data) => {
        dispatch(onSuccessBuy({
            paymentData: data,
            cartDetail: props.user.cartDetail            
        }))
            .then(response => {
                console.log(response.payload)
                if (response.payload.success) {
                    setShowTotal(false)
                    setShowSuccess(true)
                }
            })
            
       
    }





    return (
      <Row gutter={[16,16]}>
        <Col lg={{ span: 16, offset: 4 }} sm={24}> 



        <div style={{ width:'85', margin: '3rem auto' }}>
            <h1>My Cart</h1>
            <div>
                <UserCardBlock 
                products={props.user.cartDetail}
                removeItem = {removeFromCart}/>
            </div>

            {ShowTotal ?
                <div style={{ marginTop: '3rem' }}>
                    <h2> 총 주문금액: {Total} 원 </h2>
                </div>
                : ShowSuccess ?
                    <Result
                        status="success"
                        title="Successfully Purchased Items"
                    />
                    :
                    <>
                        <br />
                        <Empty description={false} />
                    </>
            
        
            }
            
        </div>

        {ShowTotal &&
            <div style={{ textAlign: 'right', marginBottom: '2rem' }}>    
            
            
            <Button size='large' shape="round" onClick={transactionSuccess}>
                    구매
            </Button></div>}
        
            </Col>
        </Row>
    )
}

export default CartPage