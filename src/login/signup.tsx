import React, {useContext, useEffect, useRef, useState} from 'react'
import { Form, Input, Button, Checkbox } from 'antd';
import {Link, useHistory} from "react-router-dom";
import {SignUpLink} from "./signin";
import FirebaseContext from "../firebase/context";


const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export const SignIn:React.FC<any> = () => {

    const [isLoading , setIsLoading] = useState(false);
    const firebase = useContext(FirebaseContext);
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState(null);
    const isMounted = useRef(false);
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        }
    });

    const onFinish = values => {
        const {email, password} = values;
        setIsLoading(true);
        firebase!.doSignInWithEmailAndPassword(email, password)
            .then(user => {
                console.log(user);
                if (!user) {
                    console.log('no user');
                } else {
                    if (user.user!.emailVerified) {
                        firebase!.currentUser = user.user;
                        history.push('/');
                    } else {
                        history.push('/email');
                    }
                }
        }).catch(e => {
            if (e && e.message) {
                setErrorMessage(e.message);
            }
        }).finally(() => {
            isMounted.current && setIsLoading(false);
        });
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button loading={isLoading} type="primary" htmlType="submit">
                    Login
                </Button>
            </Form.Item>

            {errorMessage && <p className='error'> {errorMessage} </p>}
            <SignUpLink/>
        </Form>
    );
};


