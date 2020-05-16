import {Button, Input, Form, notification} from "antd";
import React, {useContext, useEffect, useRef, useState} from "react";
import {SingInLink} from "./signin";
import FirebaseContext from "../firebase/context";
import {useHistory} from "react-router";

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export const ResetPassword = () => {

    const firebase = useContext(FirebaseContext);
    const [isLoading, setLoading] = useState(false);
    const isMounted = useRef(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [form] = Form.useForm();

    if (!firebase) {
        console.error('No provider for firebasecontext');
    }

    useEffect(() => {
        isMounted.current = true;
        return () => {isMounted.current = false};
    }, []);

    return (
        <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={(values) => {
                const email = values.email;
                setLoading(true);
                firebase!.doPasswordReset(email).then((s) => {
                    console.log(s);
                    form.resetFields();
                    notification.success({message:'A reset email has been sent'});
                }, (e) => {
                    setErrorMessage(e.message ? e.message : 'FAILED'); //TODO(chab) find a generic message
                }).finally(() => {
                    setLoading(false);
                })
            }}
        >
            <p> Enter your email to reset your password </p>
            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button loading={isLoading} type="primary" htmlType="submit">
                    Reset password
                </Button>
            </Form.Item>
            {errorMessage && <p className='error'> {errorMessage} </p>}
            <SingInLink/>
        </Form>

    );
};
