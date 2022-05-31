import React from 'react'
import {Comment, Tooltip, Rate, Avatar} from 'antd';
import moment from 'moment';


function ProductReview(props) { //product로 보내주고있음


  return (

    <div>
    <Rate disabled defaultValue={props.detail.rate} />
  
    <Comment
    //avatar={ <Avatar size="small">U</Avatar>}
    author={props.detail.author.name}
    content={ props.detail.content }
    datetime={
        <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
        <span>{moment().fromNow()}</span>
        </Tooltip>
    }
    />
   
    </div>
    
  )
}

export default ProductReview