//Upload 페이지 - 상품명, 가격, 브랜드, 급여대상, 기능 

import React, {useState} from 'react'
import {Typography, Button, Form, Input, Checkbox} from 'antd'; 
import axios from 'axios';

import FileUpload from '../../utils/FileUpload';

const CheckboxGroup = Checkbox.Group;

const { Title } = Typography;
const { TextArea } = Input;

//브랜드 정의
const Brands = [
    { key: 1, value: "NOW" }, { key: 2, value: "로얄캐닌" },
    { key: 3, value: "ANF" }, { key: 4, value: "오리젠" },
    { key: 5, value: "네츄럴코어" }, { key: 6, value: "마이펫닥터" },
    { key: 7, value: "아카나" }, { key: 8, value: "하림펫푸드" },
    { key: 9, value: "내추럴발란스" }, { key: 10, value: "듀먼" }
]

//급여대상
const Ages = [
    { key: 1, value: "퍼피" },
    { key: 2, value: "어덜트" },    
    { key: 3, value: "시니어" },
    { key: 4, value: "대형견" },    
    { key: 5, value: "임신/수유" },
    { key: 6, value: "전연령견" }
]

//기능    
const Functions = [
    { key: 1, value: "다이어트/중성화" },
    { key: 2, value: "인도어" },
    { key: 3, value: "저알러지" },
    { key: 4, value: "피부/털개선" },
    { key: 5, value: "눈물개선/눈건강" },
    { key: 6, value: "비뇨계" },
    { key: 7, value: "뼈/관절강화" },
    { key: 8, value: "퍼포먼스" },
    { key: 9, value: "냄새제거" },
    { key: 10, value: "치석제거/구강관리" },
    { key: 11, value: "면역력강화" },
    { key: 12, value: "영양공급" },
    { key: 13, value: "처방식" }
]

function UploadProductPage(props) {

    // 이름
    const [Title, setTitle] = useState("") 
    const titleChangeHandler = (event) => { 
        setTitle(event.currentTarget.value) 
    }

    // 설명
    const [Description, setDescription] = useState("")
    const descriptionChangeHandler = (event) => { 
        setDescription(event.currentTarget.value) 
    }

    // 가격
    const [Price, setPrice] = useState()  //0부터 시작
    const priceChangeHandler = (event) => { 
        setPrice(event.currentTarget.value) 
    }

        // 이미지
    const [Images, setImages] = useState([]) // array로 줌  
    const updateImages = (newImages) => {
        setImages(newImages) //이미지가 변경될 때마다 서버에 정보 전달
    }
    

    // 브랜드
    const [Brand, setBrand] = useState(1)  
    const BrandChangeHandler = (event) => { 
        setBrand(event.currentTarget.value) 
    }

    // 연령
    const [Age, setAge] = useState(1)  
    const AgeChangeHandler = (event) => { 
        setAge(event.currentTarget.value) 
    }

    // 기능  
    const [isChecked, setisChecked] = useState(false);
    const [checkedItems, setcheckedItems] = useState(new Set()); //

    const checkHandler = ({ target }) => {
        setisChecked(!isChecked);
        checkedItemHandler(target.parentNode, target.value, target.checked);
    }

    const checkedItemHandler = (box, id, isChecked) => {
        if(isChecked) {
            checkedItems.add(id);
            setcheckedItems(checkedItems);
        }
        else if (!isChecked && checkedItems.has(id)) {
            checkedItems.delete(id);
            setcheckedItems(checkedItems);
        }

        return checkedItems;
    }


    const submitHandler = (event) => { 
        event.preventDefault();

        if(!Title || !Price  || !Brand || !Age || !Images ) //모든 것이 채워지지 않으면 수행되지 않도록 설정
        {
            return alert("모든 값을 넣어주셔야 합니다.")
        }

  
        //서버에 채운 값들을 request로 보낸다.
        const body = {
            writer: props.user.userData._id,
            title: Title, 
            price: Price,
            brand: Brand,
            age: Age,
            description: Description,
            function: [...checkedItems],
            images: Images
        }

        axios.post("/api/product/uploadProduct", body)
            .then(response => {// 백엔드 결과값을 response 변수에 넣어줌
                if(response.data.success) { // 성공하면
                    alert('상품업로드 성공')
                    props.history.push('/')
                } else { //실패하면
                    alert('상품업로드 실패')
                }
            })
    }

 return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2>상품 업로드</h2> 
        </div>

        <Form onSubmitCapture={submitHandler}>
        <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
            <FileUpload refreshFunction = {updateImages} />
            
        </div>  
        <div style={{ 
            textAlign: 'left', 
            marginBottom: '2rem' ,         
            width: '350px', 
            //height: '700px',  overflowX: 'scroll' 
        }}>
        
        <br />
            <br />
            <label>상품명</label>
            <Input onChange={titleChangeHandler} value={Title} /> 
            <br />
            <br />
            <label>가격</label>
            <Input type="number" onChange={priceChangeHandler} value={Price}/>
            <br />
            <br />            
            <label>브랜드</label>
            <br />
            <select onChange = {BrandChangeHandler} value={Brand}>
                {Brands.map(item => (
                <option key={item.key} value={item.key}> {item.value}</option>
                ))} 
                
            </select>
            <br />
            <br />
            <label>급여대상</label> 
            <br />
            <select onChange = {AgeChangeHandler} value={Age}>
                {Ages.map(item => (
                <option key={item.key} value={item.key}> {item.value}</option>
                ))}  
            </select>
            <br />
            <br />               
            <label>기능</label> 
            <br />
            <div className="contStyle" >
                {Functions.map((item) => (
                    <label key={item.key} >
                        <input
                        type = "checkbox"
                        value={item.key}
                        onChange={(e) => checkHandler(e) }
                        />
                     {item.value} <br />
                     
                     </label>
                    ))}
                </div>
            <br />
            <label>설명</label>
            <TextArea onChange={descriptionChangeHandler} value={Description}/>
            <br />

            <br />
            
        </div>       
            
          
        <div style={{ textAlign: 'right', marginBottom: '2rem' }}>    
            <Button htmlType = "submit">
                확인
            </Button></div>  
        </Form>
    </div>
  )

}

export {
    Brands,
    Ages,
    Functions

}
        

export default UploadProductPage