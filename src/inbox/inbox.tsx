import React, { useState} from 'react'
import {Table, Input, Drawer} from "antd";
import {columns, generateFakeData} from "./message-table-definition";
import {useChats } from "../firebase/hook";

const { Search } = Input;

export const Inbox = () => {
    //const fb = useContext(FirebaseContext);
    const [isDrawerVisible, setDrawerVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const chats = useChats();

    return (
    <div className='inbox'>
        <Search
            placeholder="input search text"
            enterButton="Search"
            size="large"
            onSearch={value => console.log(value)}/>
        <Table columns={columns}
               onRow={(record) => ({
                   onClick: () => {
                       setSelectedRow(record);
                       setDrawerVisible(true);
                   },
               })}
               dataSource={chats}
               onChange={() => {}} />
        <Drawer
            title={`Message with ${selectedRow && selectedRow.recipients}`}
            placement="right"
            closable={false}
            width={'40%'}
            onClose={() => setDrawerVisible(false)}
            visible={isDrawerVisible}
        >
            {selectedRow && selectedRow!.message}
        </Drawer>

    </div>);
}

