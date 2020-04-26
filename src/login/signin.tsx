import React, {useContext, useEffect, useRef, useState} from 'react'
import { Form, Input, Button, Checkbox } from 'antd';
import {Link, useHistory} from "react-router-dom";
import FirebaseContext from "../firebase/context";
import './sign.less';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export const SignUp:React.FC<any> = () => {
    const firebase = useContext(FirebaseContext);
    const history = useHistory();
    const [isLoading, setLoading] = useState(false);
    const isMounted = useRef(false);
    const [errorMessage, setErrorMessage] = useState(null);

    if (!firebase) {
        console.error('No provider for firebasecontext');
    }

    useEffect(() => {
        isMounted.current = true;
        return () => {isMounted.current = false};
    }, []);


    const onFinish = (values) => {
        const {email, password} = values;
        setLoading(true);
        firebase!
            .doCreateUserWithEmailAndPassword(email, password)
            .then(authUser => {
                // Create a user in your Firebase realtime database
                return firebase!.addUser({
                    uid:authUser.user!.uid,
                    email,
                    emailVerified:false});
            })
            .then(() => {
                firebase!.doSendEmailVerification();
            })
            .then(s => {
                console.log('email sent');
                history.push('/email');
            })
            .catch(error => {
                //TODO(implement error )
                if (error && error.message) {
                    setErrorMessage(error.message);
                }
                console.log('signin error', error);
            }).finally(() =>  isMounted.current && setLoading(false));
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
                label="email"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
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
                    Create a new account
                </Button>
            </Form.Item>
            {errorMessage && <p className='error'> {errorMessage} </p>}
            <SingInLink/>
        </Form>

    );
};


export const SignUpLink = () => (
    <p className='sign-link'>
        <Link to={'/signup'}>Don't have an account? Sign Up</Link>
    </p>
);


export const SingInLink = () => (
    <p className='sign-link'>
        <Link to={'/signin'}>Already signed up ? Click here to login </Link>
    </p>
);
