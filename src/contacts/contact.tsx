import React, {useContext, useEffect, useState} from 'react'
import {Table, Input,  Modal, Button} from "antd";
import {columns, generateFakeData} from "./contact-table-definition";
import {NewContact} from "../widgets/new_contact";
import { PlusOutlined } from '@ant-design/icons';
import FirebaseContext from "../firebase/context";
import {useContacts} from "../firebase/hook";


const { Search } = Input;
export const Contact = () => {
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const contacts = useContacts();

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
                       },
                   })}
                   dataSource={contacts}
                   onChange={() => {}} />
        </div>);
}


