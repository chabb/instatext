import React, {useContext, useState} from 'react'
import {Table, Input, Drawer, Form} from "antd";
import {columns } from "./contact-table-definition";

import { PlusOutlined } from '@ant-design/icons';
import FirebaseContext from "../firebase/context";
import {useContacts} from "../firebase/hook";
import {NewContact} from "../widgets/new_contact";




const { Search } = Input;
export const Contact = () => {
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const fb = useContext(FirebaseContext);
    const [isDrawerVisible, setDrawerVisible] = useState(false);
    const contacts = useContacts();
    const [form] = Form.useForm();

    return (
        <div className='contact'>
            <Search
                placeholder="input search text"
                enterButton="Search"
                size="large"
                onSearch={value => console.log(value)}/>
            <Table columns={columns}
                   onRow={(record) => ({
                       onClick: () => {
                           setSelectedRow(record);
                           // this will trigger two rendering, but it's ok for now
                           setTimeout(() => {
                               form.resetFields();
                               setDrawerVisible(true);
                           }, 0);
                       },
                   })}
                   dataSource={contacts}
                   onChange={() => {}} />

            <Drawer
                title={`Edit contact ${selectedRow && selectedRow.contact}`}
                placement="right"
                closable={false}
                width={'40%'}
                onClose={() => setDrawerVisible(false)}
                visible={isDrawerVisible}
            >
                <NewContact
                    form={form}
                    onFinish={() => {
                        console.log('done');
                    }}
                    phoneNumber={selectedRow ? selectedRow.phoneNumber : null} contact={selectedRow ? selectedRow.contact: ''} />
            </Drawer>
        </div>);
}


