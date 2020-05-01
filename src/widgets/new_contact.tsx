import React, {useContext} from 'react'
import {Select, Form, Input, Button, notification} from "antd";
import { PhoneOutlined, ContactsOutlined, TeamOutlined} from '@ant-design/icons';
import {ModalProps} from "../constants";
import FirebaseContext from "../firebase/context";




// we build an inverted index of the contacts

export const NewContact: React.FC<ModalProps> = ({onFinish, form}) => {
    const fb = useContext(FirebaseContext);

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
                name={'CONTACT'}
                form={form}
                onFinish={({phoneNumber, contact}) => {}}>
                <Form.Item
                    validateTrigger={['onBlur']}
                    label="Contact"
                    name="contact"
                    rules={[{ required: true }]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item  validateTrigger={['onBlur']}
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
                                            return Promise.reject('Phone number is required');
                                        }
                                    },
                                }),
                            ]}
                            label='Phone Number'
                            name='phoneNumber' >

                    <Input/>
                </Form.Item>
            </Form>
        </>)
};


export const addContactFlow = (fb, form, onFinish, onFailure = () => {}) => {
    //console.log(phoneNumber, ts, contact);
    const ts = new Date();
    const {phoneNumber, contact} = form.getFieldsValue();
    fb!.addContactToCurrentUser({phoneNumber, contact, createdAt: ts.getTime()})
        .then(() => {
            console.log('Contact creation success');
            notification.success({message:'Contact successfully created', description:''})
            onFinish();
        }, (e) => {
            console.log('Contact creation failure', e);
            notification.error({message:'User could not be created', description: e})
        })
}
