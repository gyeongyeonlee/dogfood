import React from 'react';
import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
  return (
    <Menu mode={props.mode}>
    <Menu.Item key="mail">
    </Menu.Item>
    
    <SubMenu title={<a href="/ranking">랭킹</a>} />

    <SubMenu title={<a href="/product">상품</a>}>
    
      {/* <MenuItemGroup title="브랜드">
        <Menu.Item key="setting:1">Option 1</Menu.Item>
        <Menu.Item key="setting:2">Option 2</Menu.Item>
      </MenuItemGroup>
      <MenuItemGroup title="급여대상">
        <Menu.Item key="setting:3">Option 3</Menu.Item>
        <Menu.Item key="setting:4">Option 4</Menu.Item>
      </MenuItemGroup>
      <MenuItemGroup title="기능">
        <Menu.Item key="setting:5">Option 3</Menu.Item>
        <Menu.Item key="setting:6">Option 4</Menu.Item>
      </MenuItemGroup> */}
    </SubMenu>

    <SubMenu title={<span><a href="/recommend">추천</a></span>} />
{/*     
    <SubMenu title={<span>FAQ</span>} />
       */}


  </Menu>
  )
}

export default LeftMenu