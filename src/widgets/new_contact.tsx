import React, {useContext} from 'react'
import { Form, Input, notification} from "antd";
import { PhoneOutlined, ContactsOutlined, TeamOutlined} from '@ant-design/icons';
import {ModalProps} from "../constants";
import FirebaseContext from "../firebase/context";
import {ParseError, parsePhoneNumber, parsePhoneNumberFromString} from 'libphonenumber-js'



// we build an inverted index of the contacts

export const NewContact: React.FC<ModalProps> = ({onFinish, form}) => {
    const fb = useContext(FirebaseContext);

    return (
        <>
            <Form
                onValuesChange={(valueChange, allValues) => { }}
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
                                        console.log('validating');
                                        value = getFieldValue('phoneNumber');
                                        console.log('validating', value);
                                        if (!value) {
                                            return Promise.reject('Phone number is required');
                                        }
                                        let phoneNumber;

                                        try {
                                            phoneNumber = parsePhoneNumber(value);
                                        } catch (error) {
                                            if (error instanceof ParseError) {
                                                // Not a phone number, non-existent country, etc.
                                                console.log(error.message)
                                                return Promise.reject(error.message);
                                            } else {
                                                console.log('unknown error while parsing', error);
                                                switch (error) {
                                                    case 'INVALID_COUNTRY': {
                                                        return Promise.reject('Country code is invalid');
                                                    }
                                                    default: {
                                                        return Promise.reject('Your phone number is incorrect');
                                                    }
                                                }
                                            }
                                        }
                                        if (!phoneNumber.isValid() || !phoneNumber.isValid()) {
                                            return Promise.reject('Your phone number is invalid');
                                        }
                                        phoneNumber = phoneNumber.format('E.164');
                                        return fb!.checkContact(phoneNumber).get().then(d => {
                                            return (d.exists)
                                                ? Promise.reject('Phone number already exists')
                                                : Promise.resolve();
                                        })
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
    let {phoneNumber, contact} = form.getFieldsValue();
    phoneNumber = parsePhoneNumberFromString(phoneNumber)!.format('E.164');
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
