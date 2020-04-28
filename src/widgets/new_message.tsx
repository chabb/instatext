import React, {useContext, useEffect, useState} from 'react'
import {Select, Form, Input, Button} from "antd";
import { PhoneOutlined, ContactsOutlined, TeamOutlined} from '@ant-design/icons';
import {ModalProps} from "../constants";
import {DataContext} from "../PrivateZone";
import {ITContact} from "../contacts/contact-table-definition";

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

export const NewMessage: React.FC<ModalProps> = ({onFinish}) => {
    const [contacts, setContacts] = useState<any[]>([] as any[]);
    const data = useContext(DataContext);
    useEffect(() => {
        const subscription = data.contacts.subscribe((contacts) => {
            setContacts(options(contacts));
        });
        return () => subscription.unsubscribe();
    }, []);

    return (
    <>
        <Form onFinish={c => onFinish()}>
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
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Envoyer
                </Button>
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

