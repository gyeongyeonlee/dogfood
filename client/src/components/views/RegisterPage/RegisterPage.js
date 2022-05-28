import React, {useState} from 'react'
import moment from "moment";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";

import {
  Form,
  Input,
  Button,
  Divider
} from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

// 견종 정의 => 아직 안함
const Dog_breed_all = [
  { key: 1, value: "1" },
    { key: 2, value: "2" },
    { key: 3, value: "3" },
    { key: 4, value: "4" },
    { key: 5, value: "5" }
]

// 연령 정의
const Dog_age_all = [
  { key: 1, value: "1개월 이상 1세 미만" },
  { key: 2, value: "1세 이상 7세 미만" },
  { key: 3, value: "7세 이상" }
]

// 체중 정의
const Dog_weight_all = [
  { key: 1, value: "4.5kg 미만" },
  { key: 2, value: "4.5kg~10kg" },
  { key: 3, value: "10kg~25kg" },
  { key: 4, value: "25kg 이상" }
]

function RegisterPage(props) {
  const dispatch = useDispatch();

  //견종
  const [Dog_breed, setDog_breed] = useState(1) 
  const Dog_breedChangeHandler = (event) => { 
    setDog_breed(event.currentTarget.value) 
  }
  
  //연령
  const [Dog_age, setDog_age] = useState(1) 
  const Dog_ageChangeHandler = (event) => { 
    setDog_age(event.currentTarget.value) 
  }

  //체중
  const [Dog_weight, setDog_weight] = useState(1) 
  const Dog_weightChangeHandler = (event) => { 
    setDog_weight(event.currentTarget.value) 
  }

  return (

    <Formik //ID, PW, 이름, 이메일, 주소, 핸폰
      initialValues={{
        id: '',
        password: '',
        confirmPassword: '',
        name: '',
        email: '',
        address: '',
        phone: '',

        // 강아지 정보
        dog_breed: '',
        dog_age: '',
        dog_weight: ''
      }}

      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required('Name is required'),
        email: Yup.string()
          .email('Email is invalid')
          .required('Email is required'),

        //////
        address: Yup.string()
          .required('address is required'),
        phone: Yup.string()
          .required('phone is required'),  

        ////////  
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Confirm Password is required')
      })}

      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {

          let dataToSubmit = {
            id: values.id,
            password: values.password,
            name: values.name,
            email: values.email,
            phone: values.phone,
            address: values.address,

            dog_breed: Dog_breed,
            dog_age: Dog_age,            
            dog_weight: Dog_weight
              
          };

          dispatch(registerUser(dataToSubmit)).then(response => {
            if (response.payload.success) {
              props.history.push("/login");
            } else {
              alert(response.payload.err.errmsg)
            }
          })

          setSubmitting(false);
        }, 500);
      }}
    >
      {props => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
        } = props;

        return (
          <div className="app">
            <h2>회원가입</h2>
            
            <Form style={{ minWidth: '375px'}} {...formItemLayout} onSubmit={handleSubmit} >

            <Form.Item required label="아이디" 
              hasFeedback validateStatus={errors.password && touched.password ? "error" : 'success'}>
                <Input
                  id="id"
                  placeholder="Enter your id"
                  type="text"
                  value={values.id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.id && touched.id ? 'text-input error' : 'text-input'
                  }
                />
                {errors.id && touched.id && (
                  <div className="input-feedback">{errors.id}</div>
                )}
              </Form.Item>

              <Form.Item required label="비밀번호" 
              hasFeedback validateStatus={errors.password && touched.password ? "error" : 'success'}>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.password && touched.password ? 'text-input error' : 'text-input'
                  }
                />
                {errors.password && touched.password && (
                  <div className="input-feedback">{errors.password}</div>
                )}
              </Form.Item>

              <Form.Item required label="비밀번호 재확인" hasFeedback>
                <Input
                  id="confirmPassword"
                  placeholder="Enter your confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.confirmPassword && touched.confirmPassword ? 'text-input error' : 'text-input'
                  }
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className="input-feedback">{errors.confirmPassword}</div>
                )}
              </Form.Item>

              <Form.Item required label="이름">
                <Input
                  id="name"
                  placeholder="Enter your name"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.name && touched.name ? 'text-input error' : 'text-input'
                  }
                />
                {errors.name && touched.name && (
                  <div className="input-feedback">{errors.name}</div>
                )}
              </Form.Item>

              <Form.Item required label="이메일" 
             //</Form> hasFeedback validateStatus={errors.email && touched.email ? "error" : 'success'}
             >
                <Input
                  id="email"
                  placeholder="Enter your Email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.email && touched.email ? 'text-input error' : 'text-input'
                  }
                />
                {errors.email && touched.email && (
                  <div className="input-feedback">{errors.email}</div>
                )}
              </Form.Item>

              <Form.Item required label="휴대전화">
                <Input
                  id="phone"
                  placeholder="Enter your phone"
                  type="text"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.phone && touched.phone ? 'text-input error' : 'text-input'
                  }
                />
                {errors.phone && touched.phone && (
                  <div className="input-feedback">{errors.phone}</div>
                )}
              </Form.Item>
            
              <Form.Item required label="주소">
                <Input
                  id="address"
                  placeholder="Enter your address"
                  type="text"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.address && touched.address ? 'text-input error' : 'text-input'
                  }
                />
                {errors.address && touched.address && (
                  <div className="input-feedback">{errors.address}</div>
                )}
              </Form.Item>      

              <Divider />
              <h2 >추가 정보</h2>     

              <Form.Item required label="견종">
                <select onChange= 
                {Dog_breedChangeHandler} value={Dog_breed}>
                    {Dog_breed_all.map(item => (
                    <option key={item.key} value={item.key}> {item.value}</option>
                    ))}                 
                </select>
                
              </Form.Item>   

              <Form.Item required label="연령">
                <select onChange=
                {Dog_ageChangeHandler} value={Dog_age}>
                    {Dog_age_all.map(item => (
                    <option key={item.key} value={item.key}> {item.value}</option>
                    ))}                 
                </select>
                
              </Form.Item>   

              <Form.Item required label="체중">
                <select onChange= 
                {Dog_weightChangeHandler} value={Dog_weight}>
                    {Dog_weight_all.map(item => (
                    <option key={item.key} value={item.key}> {item.value}</option>
                    ))}                 
                </select>
                
              </Form.Item>  
       
              <Form.Item {...tailFormItemLayout}>
                <Button onClick={handleSubmit} type="primary" disabled={isSubmitting}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
};


export default RegisterPage