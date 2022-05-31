import React, {useState} from 'react'
import Dropzone from 'react-dropzone';
import {Icon} from 'antd';
import axios from 'axios';


function FileUpload(props) {

    const [Images, setImages] = useState([]);

    const dropHandler = (files) => {
        let formData = new FormData();
        
        const config = { //정보 보내기, 백엔드에서 request받을때 에러없이
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append("file", files[0]) //올리는 파일정보
        
        axios.post('/api/product/image', formData, config )
        .then(response => { //받아온 정보 
            if(response.data.success){
                console.log(response.data)
                //useState이용해서 이미지 배열['','',... ] 받아옴
                setImages([...Images, response.data.filePath])
                props.refreshFunction([...Images, response.data.filePath])
           //부모 컴포넌트로 올라와서 images에 담기게됨
            } else {
                alert("파일을 저장하는데 실패하였습니다.")
            }
        }) 
    }

    const deleteHandler = (image) => {

        const currentIndex = Images.indexOf(image)
        
        let newImages = [...Images]
        newImages.splice(currentIndex, 1)

        setImages(newImages)
        props.refreshFunction(newImages)
    }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Dropzone onDrop={dropHandler}>
        {({getRootProps, getInputProps}) => (
            <div style={{ width: 300, height: 240, border: '1px solid lightgray',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'  
                        }}       
                {...getRootProps()}>
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: '3rem' }} />
            </div>
        )}
        </Dropzone>
        <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll' }}>
            {Images.map((image, index) =>(
                <div onClick={() => deleteHandler(image)} key={index}>
                    <img style={{ minWidth: '300px', width: '300px', height: '240px' }}
                        src={`http://localhost:5000/${image}`} //src={`http://localhost:5000/${image.filePath}`}
                        //아니 ''이거 안쓰고 저거썼다고 오류 사라짐;;;;; 개빡침
            
                    />
                </div>
            ))}


        </div>
        

    </div>
  )
}

export default FileUpload