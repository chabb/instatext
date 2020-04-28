import React, {useContext} from 'react'
import {Select, Form, Input, Button} from "antd";
import { PhoneOutlined, ContactsOutlined, TeamOutlined} from '@ant-design/icons';
import {ModalProps} from "../constants";
import FirebaseContext from "../firebase/context";
import {useForm} from "antd/lib/form/Form";



// we build an inverted index of the contacts

export const NewContact: React.FC<ModalProps> = ({onFinish}) => {
    const fb = useContext(FirebaseContext);

    const form = useForm();
    console.log('FB', fb);

    return (
        <>
            <Form
                onValuesChange={(valueChange, allValues) => {
                    // MAYBE( validate things manually here */
                    /*console.log(allValues);
                    if (valueChange.phoneNumber) {
                        fb!.checkContact(valueChange.phoneNumber).get().then(d => {
                            if (d.exists) {
                                console.log('here', form);
                            } else {
                                console.log('not there');
                            }
                        })
                    }*/
                }}
                onFinish={({phoneNumber, contact}) => {
                const ts = new Date();
                console.log(phoneNumber, ts, contact);
                fb!.addContactToCurrentUser({phoneNumber, contact, createdAt: ts.getTime()});
            }}>
                <Form.Item
                    validateTrigger={['onBlur']}
                    label="Contact"
                    name="contact"
                    rules={[{ required: true }]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item  validateTrigger={['onBlur']}
                            label='Phone Number'
                            name='phoneNumber' >
                    <Input/>
                </Form.Item>
                <Form.Item validateTrigger={['onSubmit']}
                           rules={[
                               ({ getFieldValue }) => ({
                                   validator(rule, value) {
                                       value = getFieldValue('phoneNumber');
                                       if (value) {
                                           return fb!.checkContact(value).get().then(d => {
                                               return (d.exists)
                                                   ? Promise.reject('Phone number already exists')
                                                   : Promise.resolve();
                                           })
                                       } else {
                                           return Promise.reject('Please confirm your pg!');
                                       }
                                   },
                               }),
                           ]
                }>
                    <Button type="primary" htmlType="submit">
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </>)
};

