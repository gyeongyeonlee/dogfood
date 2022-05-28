import React from 'react'

function HistoryPage(props) {



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
                        props.user.userData.history.map(item => (
                            <tr key={item.id}>
                                <td>{item.dateOfPurchase}</td>
                                <td>{item.name}</td>
                                <td>{item.price}</td>
                                <td>{item.quantity}</td>
                                <td> 
                                    {/* <button onClick={() => props.removeItem(product._id)}>
                                    리뷰작성
                                    </button> */}
                                    {console.log(item.id)}
                                </td>
  
                                
                            </tr>
                            
                        ))}
                        

{/* 
                    {props.user.userData && props.user.userData.history &&
                    props.user.userData.history.map(item => ( 
                                              
                    console.log(item)
                           
                            
                        ))}
                         */}
                        

                </tbody>
            </table>
        </div>
    )
}

export default HistoryPage