import React, { useState } from 'react';
import { Tabs } from 'antd';
import '../Introduce/introduce.css';


const { TabPane } = Tabs;



function Introduce() {

    const [tabPosition, setTabPosition] = useState('left');

  const changeTabPosition = (e) => {
    setTabPosition(e.target.value);
  };

  return (
    <div style={{ width: '75%', margin: '3rem auto'}}>
        <div style={{ width: '75%', margin: '3rem auto' }}>
        
        <p id="Letter"> 'FOR MY PUPPY'는</p>
        <p id="sLetter"> 반려견에게 적합한 사료를 선택할 수 있도록 도와주는 
            강아지 사료 추천 및 판매 웹사이트입니다. 
            선호 사료와 유사한 제품을 추천하고,
            다른 사람들의 리뷰를 통해 사료의 호불호 파악이 가능하여             
            이용자가 보다 쉽게 사료에 대한 정보를 얻을 수 있도록 
            다음과 같은 기능들을 제공하고 있습니다.
            </p>
        
        </div>
        
        <div/>

  <div className="card-container">
    <Tabs type="card" >
      <TabPane tab="유사상품 추천" key="1">
        <Tabs tabPosition={tabPosition}>        
            <TabPane tab="아이템 기반 협업필터링" key="1">
            <p id="Bold">상품에 rating된 값을 코사인 유사도를 이용해 분석
              </p>
            <br/>
            상품을 구매한 구매자가 리뷰를 작성할 때 준 별점을 바탕으로 
            추천페이지에서 유사 상품을 확인할 수 있다. 
            이용자가 직접 찾아보지 않아도 쉽게 사료에 대한 정보를 얻을 수 있다.
            
            </TabPane>
            <TabPane tab="TF-IDF" key="2">
            <p id="Bold">상품 기능 정보들을 이용하여 관련 기능을 가진 유사 상품 추천
            </p><br/>
            상품과 관련이 있는 기능을 가진 유사 상품을 추천해준다. 
            이용자들이 관심있는 상품을 볼 때 유사한 상품을 함께 볼 수 있기에 
            선택의 폭이 넓어지고, 다른 상품 선택에 도움을 줄 수 있다.
            </TabPane>
            
        </Tabs>
      </TabPane>

      <TabPane tab="리뷰 긍정/부정 분석" key="2">
        
            <p id="Bold">1. 양방향 LSTM 이용한 상품 리뷰 긍부정 분석
            </p>
            상품상세페이지의 '딥러닝을 통한 리뷰 분석' 버튼을 누르면 해당 상품의 분석을 볼 수 있다.
             상품 리뷰를 통한 긍부정 결과는 이용자가 상품을 구매할 때 유용한 정보가 될 것이다. 
            
            <br/>
            <br/>

            <p id="Bold">2. 새 리뷰 작성했을 때 긍/부정 판별</p>
  
            Mypage에서 이용자가 구매한 상품에 대한 리뷰를 작성할 때 
            해당 리뷰가 긍정인지 부정인지 판별이 가능하다. 
            
            <br/>
            <br/>

            <p id="Bold">3. 리뷰의 키워드 파악</p>

            상품마다 리뷰의 키워드를 상품상세페이지에서 확인할 수 있다. 
            키워드를 통해 상품의 주요 기능과 특징을 알 수 있다. 
            
            <div/>
             
            
      </TabPane>
      
    </Tabs>
  </div>
  </div>
)
}

export default Introduce