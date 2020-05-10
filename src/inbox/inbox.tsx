import React, {useContext, useRef, useState} from 'react'
import {Table, Input, Drawer} from "antd";
import {columns, generateFakeData} from "./message-table-definition";
import {useChats } from "../firebase/hook";
import {MessageDirection} from "../firebase/data-context";
import {DataContext} from "../PrivateZone";
import {takeUntil, takeWhile} from "rxjs/operators";

const { Search } = Input;

export const Inbox = () => {
    //const fb = useContext(FirebaseContext);
    const [isDrawerVisible, setDrawerVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const subs = useRef();

    const chats = useChats();

    const data = useContext(DataContext); // make something similar as useChats

    return (
    <div className='inbox'>
        <Search
            placeholder="input search text"
            enterButton="Search"
            size="large"
            onSearch={value => console.log(value)}/>
        <Table columns={columns}
               onRow={(record: any) => ({ // TODO go back to ITMessage
                   onClick: () => {
                       console.log('row selected', record);
                       setSelectedRow(record);
                       let number;
                       if ((record as any).direction === MessageDirection.INBOUND) {
                           number = record.from;
                       } else {
                           number = record.to;
                       }
                       data.startChatSnapshot(number);
                       setDrawerVisible(true);
                       data.chat.pipe(takeWhile(() => isDrawerVisible))
                           .subscribe((v) => {
                               console.log('stuff', v);
                            });
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

