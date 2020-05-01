import React, {useContext, useEffect, useState} from 'react'
import {Select, Form, Input, Button, notification} from "antd";
import { PhoneOutlined, ContactsOutlined, TeamOutlined} from '@ant-design/icons';
import {ModalProps} from "../constants";
import {DataContext} from "../PrivateZone";
import {ITContact} from "../contacts/contact-table-definition";
import FirebaseContext from "../firebase/context";
import {useContacts} from "../firebase/hook";


const { Option } = Select;

enum OptionType {
    GROUP = 'group',
    NUMBER = 'number',
    CONTACT = 'contact'
}
/*interface ItContact {
    name: string,
    id?: string,
    phoneNumber: string
}


const contacts: ItContact[] = [
    {name:'Robert', phoneNumber: '32443225', id:'1'},
    {name:'James', phoneNumber: '3223255', id:'2'},
    {name:'Patricia', phoneNumber: '54745645', id:'3'},
    {name:'Guignol', phoneNumber: '35235523', id:'4'}];*/


const options = contacts => contacts.reduce((acc, ct: ITContact & {id: string, key: string}) => {
    acc.push({value: ct.phoneNumber, id: `${ct.id}`, type:OptionType.NUMBER});
    acc.push({value: ct.contact, id: `${ct.id}`, type:OptionType.CONTACT});
    return acc;
}, [] as any[]);

// we build an inverted index of the contacts

export const NewMessage: React.FC<ModalProps> = ({onFinish, form}) => {
    const contacts = useContacts(options);

    return (
    <>
        <Form name='message' form={form}
            onFinish={({message,recipients}) => {
            // expose an handler to parent instead
            // move this thing to RxJS

        }}>
            <Form.Item
                validateTrigger={['onBlur']}
                label="Recipients"
                name="recipients"
                rules={[{ required: true }]}
            >
            <Select mode="tags" style={{ width: '100%' }}
                    optionFilterProp={'label'}
                    filterOption={true}
                    placeholder="Tags Mode">
                {contacts.map(option => <Option
                    label={option.value}
                    key={option.id + option.type} value={option.id}>
                    {getIcon(option.type)} {option.value}
                </Option> )}
            </Select>
            </Form.Item>
            <Form.Item  validateTrigger={['onBlur']} label='Message' name='message' rules={[{ required: true }]}>
                <Input.TextArea />
            </Form.Item>
        </Form>
    </>)
};

const getIcon = type => {
    switch (type) {
        case OptionType.NUMBER: return <PhoneOutlined/>;
        case OptionType.CONTACT: return <ContactsOutlined/>;
        case OptionType.GROUP: return <TeamOutlined/>;
        default:
            console.error('Incorrect contact type', type);
    }
};

// we can send to a contact, a group, or a phone number
// we'll get an array of

export const sendMessageFlow = (fb, form): Promise<any> => {
    const {recipients, message } = form.getFieldsValue();

    return fb!.sendSMSMessage('+19145590987', recipients[0], message)
        .then(
            (m) => {
                console.log('sent message succesfully');
                return fb!.addMessageToDb(m.from, recipients[0], message, m.id, m.status).then(() => {
                    console.log('sent ms success', m);
                    notification.success({message: 'Message has been sent'});
                    return m;
                }, e => {
                    console.error('sent ms fail', e);
                    notification.error({message:'Message could not be saved', description: e});
                    return Promise.reject(e);
                })
            },
            (e) => {
                console.log('not sent ms', e);
                notification.error({message:'Message could not be sent', description: e});
                return Promise.reject(e);
            }).then( () => {console.log('success')}, (e) => {console.log('failure', e)})
};
