import React, { useState } from 'react'
import { Checkbox,Col } from 'antd';


//const { Panel } = Collapse;

function CheckBox(props) { //continents를 list로 넣어줌

  const [Checked, setChecked] = useState([]) //체크하면 해당하는 숫자가 들어감

  const handleToggle = (value) => {
    //누른 것의 index구하고
    const currentIndex = Checked.indexOf(value) 

    //전체 Checked된 State에서 현재 누른 Checkbox가 이미 있다면

    const newChecked = [...Checked]
    
    //없으면 State에 넣어준다. 
    if(currentIndex === -1) {//-1이면 value 가 없는 거
      newChecked.push(value)
    
    // 뺴주고
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked) //newChecked로 바뀜
    props.handleFilters(newChecked)// 부모 폴더에 전달

  }

  const renderCheckboxLists = () => props.list && props.list.map((value, index) => (
    <React.Fragment key={index} >
     <Col lg={{ span: 4}} md={8} sm={24}> 
      <Checkbox onChange={() => handleToggle(value._id)} 
          checked={Checked.indexOf(value._id) === -1 ? false : true} />
        <span>{value.name}</span>
        </Col>
    </React.Fragment>
  ))

  return (
    <div>
        {renderCheckboxLists()}      
    </div>
  )
}

export default CheckBox