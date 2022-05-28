import React, {useState} from 'react'
import { Input} from 'antd';

const { Search } = Input;

function SearchFeature(props) {
  

    const [SearchTerm, setSearchTerm] = useState("")

    const searchHandler = (event) => {
        setSearchTerm(event.currentTarget.value)
        props.refreshFunction(event.currentTarget.value)
    }
  
  
    return (
    <div>

    <Search
        placeholder="input search text"
        onChange={searchHandler}
        style={{ width: 200}}
        value={SearchTerm} //value 바뀌면서 값 달라짐

        />

    </div>
  )
}

export default SearchFeature