import React, { useState } from 'react'
import { Collapse, Radio } from 'antd';

const { Panel } = Collapse;


function RadioBox(props) {

  const [Value, setValue] = useState(0)

  const rederRadioBox = () => (
    props.list && props.list.map(value => (

      <Radio key={value._id} value={value._id}> {value.name}

      </Radio>

    ))
  )

  const handleChange = (event) => {
    setValue(event.target.value)
    props.handleFilters(event.target.value)

  }

  return (
    <div>
      

          <Radio.Group onChange={handleChange} value={Value}>
            {rederRadioBox()}
          </Radio.Group>
          

        
    </div>
  )
}

export default RadioBox