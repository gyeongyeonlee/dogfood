import { Button, Modal, Rate } from 'antd';
import React, { useState, useEffect  } from 'react';
import TextArea from 'antd/lib/input/TextArea';
import axios from 'axios';



function HistoryPage(props) {

    
        const [visible, setVisible] = useState(false);
        const [confirmLoading, setConfirmLoading] = useState(false);
      
        //리뷰 content
        const [Description, setDescription] = useState("")
        const descriptionChangeHandler = (event) => { 
            setDescription(event.currentTarget.value) 
        }

        //리뷰 rate
        const [rate, setrate] = useState()

        const [proId, setproId] = useState("")
        

        // 팝업
        const showModal = () => {

          setVisible(true);
        };
      
        const handleOk = () => {
          //setModalText();
          setConfirmLoading(true);
          setTimeout(() => {
            setVisible(false);
            setConfirmLoading(false);
          }, 2000);

        };
      
        const handleCancel = () => {
          console.log('Clicked cancel button');
          setVisible(false);
        };

        const submitHandler = () => { 
            //event.preventDefault();
            
            console.log("proid",proId)
      
            
            const body = {
                
                author: props.user.userData._id,
                product: proId,
                rate: rate,
                content: Description

                
            }
            
            console.log(body)
    
            axios.post("/api/users/uploadReview", body)
                .then(response => {// 백엔드 결과값을 response 변수에 넣어줌
                    if(response.data.success) { // 성공하면
                        alert('성공')
                        props.history.push('/')
                    } else { //실패하면
                        alert('실패')
                    }
                })
        }

                  



    return (
        <div style={{ width: '80%', margin: '3rem auto' }}>
            <br />

            <table>
                <thead>
                    <tr>
                        <th>주문번호</th>
                        <th>상품</th>
                        <th>가격</th>
                        <th>개수</th>
                        <th>리뷰쓰기</th>
                        
                    </tr>
                </thead>

                <tbody>
                {props.user.userData && 
                        props.user.userData.history.map((item, index) => (
                            <tr key={index}>
                                <td>{item.dateOfPurchase}</td>
                                <td>{item.name}</td>
                                <td>{item.price}</td>
                                <td>{item.quantity}</td>
                                
                                <td> 
                                <Button type="primary" 
                                        onClick={() => (
                                        showModal(),
                                        setproId(item.id),
                                        console.log(index, proId)
                                        )}
                                        // onClick={
                                        //     showModal}
                                            
                                        >
                                    리뷰작성
                                </Button>


                                
                                <Modal
                                    title="리뷰를 작성해주세요"
                                    visible={visible}
                                    onOk={() =>(
                                        handleOk,
                                        submitHandler()
                                       
                                        )}
                                    confirmLoading={confirmLoading}
                                    onCancel={handleCancel}
                                   
                                >                    

                                    <Rate defaultValue={0} 
                                        onChange={setrate}                                        
                                        />
                                        
                                    <br/>
                                    <br/>

                                    <TextArea onChange={descriptionChangeHandler} 
                                                value={Description}/>
                                </Modal>
                                </td>
                            </tr>
                            
                            
                        ))}
                                             

                </tbody>
            </table>
        </div>
    )
}

export default HistoryPage



