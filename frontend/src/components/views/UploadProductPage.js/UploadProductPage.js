//Upload 페이지 - 상품명, 가격, 브랜드, 급여대상, 기능 

import React, {useState} from 'react'
import {Typography, Button, Form, Input, Checkbox} from 'antd'; 
// import FileUpload from '../../utils/FileUpload'; //파일 업로드
import axios from 'axios';
//
import { Brands,  Ages, Functions } from './Section/Datas'
import FileUpload from '../../utils/FileUpload';

const CheckboxGroup = Checkbox.Group;

const { Title } = Typography;
const { TextArea } = Input;


function UploadProductPage(props) {

    // 이름
    const [Title, setTitle] = useState("")
    const titleChangeHandler = (event) => {
        setTitle(event.currentTarget.value)
    }

    // 가격
    const [Price, setPrice] = useState(0)  //0부터 시작
    const priceChangeHandler = (event) => {
        setPrice(event.currentTarget.value)
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
            box.style.backgroundColor = "#F6CB44";
        }
        else if (!isChecked && checkedItems.has(id)) {
            checkedItems.delete(id);
            setcheckedItems(checkedItems);
            box.style.backgroundColor = "#fff";
        }
        console.log([...checkedItems]);
        return checkedItems;
    }


    // 이미지
    const [Images, setImages] = useState([]) // array로 줌
    const updateImages = (newImages) => {
        setImages(newImages) //이미지가 변경될 때마다 서버에 정보 전달
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
            function: [...checkedItems],
            images: Images
        }

        axios.post("/api/product", body)
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
            <label>가격($)</label>
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
            <div className="contStyle">
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

        </div>


        <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
            <Button htmlType = "submit">
                확인
            </Button></div>
        </Form>
    </div>
  )

                }


export default UploadProductPage