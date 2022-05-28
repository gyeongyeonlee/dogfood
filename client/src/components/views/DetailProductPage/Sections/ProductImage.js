import React, {useState, useEffect} from 'react'
import ImageGallery from 'react-image-gallery'

function ProductImage(props) {
    const [Images, setImages] = useState([])

    useEffect(() => {
        if(props.detail.images && props.detail.images.length > 0){
            let images = []

            props.detail.images.map(item => {
                images.push({ //동적으로 처리해줘야함, 포트번호등등 
                    original: `http://localhost:5000/${item}`,
                    thumbnail: `http://localhost:5000/${item}`
                })
            })

            setImages(images)
        }

    }, [props.detail]) //[]비어있는경우, 렌더링후 useeffect 작동 후  []에 아무것도 들어있지않음, 
    //하지만 앞에서 propsdetail이 바뀌기 때문에 다시 가져와서/작동해서 Images에 들어감 -> 이미지 나옴
    
  return (
    <div>
        <ImageGallery
        // originalHeight = '100'
        // originalWidth = '100'
        // sizes = '20'
        items={Images}/>
    </div>
  )
}

export default ProductImage