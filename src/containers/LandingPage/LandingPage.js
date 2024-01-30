import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert, Divider } from 'antd';
import { GoogleCircleFilled } from '@ant-design/icons';
import 'antd/dist/antd.min.css';
import './LandingPage.css';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../../assets/empanada-legadera.jpg';
import Register from '../Register/Register';
import RecoverPassword from '../../components/RecoverPassword/RecoverPassword';
import { loginUser, loginUserWithGoogle } from '../../sevices/utils';
import { useNavigate } from "react-router-dom";
import { UnauthenticatedLayout as Layout } from "../_layout/unauthenticated/index";

const initialAlertResponse = {
  status: false,
  message: ""
}

export default function LandingPage() {
  let navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(initialAlertResponse);

  const onFinish = async (values) => {
    const response = await loginUser(values.username, values.password);
    if (response.hasOwnProperty("message")) {
      setShowAlert({
        status: true,
        message: "El usuario y/o contraseña son incorrectos."
      });
    }
    if (response.hasOwnProperty("user")) {
      navigate("/historial");
    }
  };

  const closeAlert = () => {
    setShowAlert(initialAlertResponse)
  }

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(initialAlertResponse);;
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert])

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onGoogleLogin = async () => {
    const response = await loginUserWithGoogle();
    if (response.hasOwnProperty("user")) {
      navigate("/historial");
    } else {
      setShowAlert({
        status: true,
        message: "Intente con otro método o espere un insante e intente nuevamente"
      });
    }
  };

  return (
    <Layout>
      <div>
        <h1 className='login-title'>Empanada Legadera</h1>
        <div className='logo-img-container'>
          <img src={Logo} alt='Logo' className='logo-img' />
        </div>
        <Container>
          <div className='login-button-container'>
            <Button type="primary" shape="round" className='google-login-button'
              onClick={onGoogleLogin} icon={<GoogleCircleFilled />}>
              Ingresar con Google
            </Button>
          </div>
          <div className='divider-container'>
            <Divider>o</Divider>
          </div>
          <Form
            name="basic"
            layout="vertical"
            labelCol={{
              xs: { span: 2 },
              sm: { offset: 6, span: 12 },
              md: { offset: 7, span: 10 },
              lg: { offset: 8, span: 8 }
            }}
            wrapperCol={{
              xs: { span: 2 },
              sm: { offset: 6, span: 12 },
              md: { offset: 7, span: 10 },
              lg: { offset: 8, span: 8 }
            }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Email de usuario"
              name="username"
              rules={[{ required: true, message: 'Email requerido para ingresar' }]}
            >
              <Input placeholder="Ingrese su e-mail" />
            </Form.Item>
            <Form.Item
              label="Contraseña"
              name="password"
              rules={[{ required: true, message: 'Contraseña requerida para ingresar' }]}
            >
              <Input.Password placeholder="Ingrese su e-contraseña" />
            </Form.Item>
            <div className='login-button-container'>
              <Button type="primary" shape="round" htmlType="submit" className='login-button'>
                Ingresar
              </Button>
            </div>
            <div className='register-button-container'>
              <Register />
            </div>
            <div className='reset-password-container'>
              <RecoverPassword />
            </div>
          </Form>
        </Container>
        <div>
          {showAlert?.status ?
            <Alert
              message="Algo falló"
              description={showAlert?.message}
              type="error"
              showIcon
              closable
              onClose={closeAlert}
            />
            :
            null
          }
        </div>
      </div>
    </Layout>
  )
}

