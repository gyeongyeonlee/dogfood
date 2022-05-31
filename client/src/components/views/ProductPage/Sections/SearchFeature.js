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
        placeholder="검색어를 입력하세요"
        onChange={searchHandler}
        style={{ width: 300}}
        value={SearchTerm} //value 바뀌면서 값 달라짐
        size="large"

        />

    </div>
  )
}

export default SearchFeature