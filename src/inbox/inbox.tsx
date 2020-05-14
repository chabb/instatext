import React, {useContext, useEffect, useRef, useState} from 'react'
import {Table, Input, Drawer} from "antd";
import {columns, getMessageStatusIcon} from "./message-table-definition";
import {useChats, useContacts} from "../firebase/hook";
import {MessageDirection} from "../firebase/data-context";
import {DataContext} from "../PrivateZone";
import {takeWhile} from "rxjs/operators";
import { timeFormat} from 'd3-time-format';
import './messages.less'

const formatTime = timeFormat("%B %d, %Y  %H:%M");


const { Search } = Input;

export const Inbox = () => {
    //const fb = useContext(FirebaseContext);
    const contacts = useContacts();

    const [isDrawerVisible, setDrawerVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [messages, setMessages] = useState<any>([]);
    const drawer = useRef(false);
    const chats = useChats();
    const data = useContext(DataContext); // make something similar as useChats

    const contactsDico = useRef({});
    const contact = useRef({} as any);

    useEffect(() => {
        const sub = data.contacts.subscribe((v) => {
            contactsDico.current = v.reduce((acc, contact) => {
                acc[contact.phoneNumber] = contact;
                return acc;
            }, {});
        });
        return () => {
            sub.unsubscribe();
        }
    });


    const _onclick = (record) => {
            setSelectedRow(record);
            let number;
            if ((record as any).direction === MessageDirection.INBOUND) {
                number = record.from;
            } else {
                number = record.to;
            }

            drawer.current = true;
            data.startChatSnapshot(number);
            console.log('is ---', drawer.current);
            data.chat.pipe(takeWhile(() => drawer.current))
                .subscribe((v) => {
                    console.log('------>');
                    setMessages(v);
                });

            contact.current = contactsDico.current[number];
            console.log('will update', number, contactsDico, contact.current);
            //TODO(chab) use loading indicator instead
            setTimeout(() => {
                setDrawerVisible(true);
            }, 50)
        };

    return (
    <div className='inbox'>
        <Search
            placeholder="input search text"
            enterButton="Search"
            size="large"
            onSearch={value => console.log(value)}/>
        <Table columns={columns}
               dataSource={chats}
               onChange={() => {}}
               onRow={(record: any) => ({ // TODO go back to ITMessage
                   onClick: () => _onclick(record) })} />
        <Drawer
            title={`Message with ${contact.current.contact}`}
            placement="right"
            closable={false}
            width={'40%'}
            onClose={() => {
                console.log('close');
                drawer.current = false;
                setDrawerVisible(false);
                setMessages([]);
            }}
            visible={isDrawerVisible}
        >
            {(messages || []).map(m =>
                <div className='messages' key={m.sid}>

                        <div className={`${m.direction}-message`}>
                            <div>{m.message}  {m.direction === 'outbound' && getMessageStatusIcon(m.status)} </div>
                            <div>{formatTime(m.ts)}</div>
                        </div>
                </div>
            )}
        </Drawer>
    </div>);
}

