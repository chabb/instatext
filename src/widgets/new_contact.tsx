import React from 'react'
import {Select, Form, Input, Button} from "antd";
import { PhoneOutlined, ContactsOutlined, TeamOutlined} from '@ant-design/icons';



// we build an inverted index of the contacts

export const NewContact: React.FC<any> = () => {
    return (
        <>
            <Form>
                <Form.Item
                    validateTrigger={['onBlur']}
                    label="Contact"
                    name="contact"
                    rules={[{ required: true }]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item  validateTrigger={['onBlur']} label='Phone Number' name='phoneNumber' rules={[{ required: true }]}>
                    <Input/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </>)
};
