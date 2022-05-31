/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu, Icon, Badge } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";

function RightMenu(props) {
  const user = useSelector(state => state.user);


  // const logoutHandler = () => {
  //   axios.get(`${USER_SERVER}/logout`).then(response => {
  //     if (response.status === 200) {
  //       props.history.push("/login");
  //     } else {
  //       alert('Log Out Failed')
  //     }
  //   });
  // };
  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`, {params: {userId: localStorage.getItem('userId')}}).then(response => {
      if (response.status === 200) {
        localStorage.removeItem('userId');
        props.history.push("/login");
      } else {
        alert('Log Out Failed')
      }
    });
  };

  

if (user.userData && !user.userData.isAuth) { //비로그인
  return (
    <Menu mode={props.mode}> 
    <Menu.Item key="mail"> 
      <a href="/login">로그인</a>
    </Menu.Item>
    <Menu.Item key="app">
      <a href="/register">회원가입</a>
    </Menu.Item>
  </Menu>
  )
} 
else { //로그인
    if(user.userData && !user.userData.isAdmin) { //회원
      return (
        <Menu mode={props.mode}>


         

                    
          

          <Menu.Item key="logout">
          <a onClick={logoutHandler}>LOGOUT</a>
          </Menu.Item>

          <Menu.Item key="history">
            <a href="/history">MY</a>
          </Menu.Item>

        <Menu.Item key="cart" //카트
          style={{ paddingBottom: 3, paddingRight: 50 }}>
            <Badge count={user.userData && user.userData.cart.length} >
              <a href="/user/cart" className="head-example"
              style = {{ marginRight:-22, color: '#667777'}}>
                <Icon type="shopping-cart" style={{ fontSize: 30, marginBottom: 3 }} />
                </a>
            </Badge>          
          </Menu.Item>
          


      </Menu>
      
    )
  }
  else { //관리자
    return (
      <Menu mode={props.mode}>

        <Menu.Item key="upload" //업로드페이지
        >
          <a href="/product/upload">AdminPage</a>
        </Menu.Item>

        <Menu.Item key="logout">
          <a onClick={logoutHandler}>로그아웃</a>
        </Menu.Item>

      </Menu>

    )
  }
}

}



export default withRouter(RightMenu);
