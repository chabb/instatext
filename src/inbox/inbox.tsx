import React, {useContext, useEffect, useRef, useState} from 'react'
import {Table, Input, Drawer, Form} from "antd";
import {columns, getMessageStatusIcon} from "./message-table-definition";
import {useChats, useContacts} from "../firebase/hook";
import {MessageDirection} from "../firebase/data-context";
import {DataContext} from "../PrivateZone";
import {takeWhile} from "rxjs/operators";
import { timeFormat} from 'd3-time-format';
import './messages.less'
import {sendMessageFlow} from "../widgets/new_message";
import FirebaseContext from "../firebase/context";
import {useForm} from "antd/es/form/util";

const formatTime = timeFormat("%B %d, %Y  %H:%M");


const { Search, TextArea } = Input;

export const Inbox = () => {
    const fb = useContext(FirebaseContext)!;
    const contacts = useContacts();
    const form = useRef(null as any) ;

    const [isLoading, setIsLoading] = useState(false);
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
               showHeader={false}
               dataSource={chats}
               onChange={() => {}}
               onRow={(record: any) => ({ // TODO go back to ITMessage
                   onClick: () => _onclick(record) })} />
        <Drawer
            title={`Message with ${selectedRow ? selectedRow.contactName : ''}`}
            placement="right"
            closable={false}
            className='message-drawer'
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
                            <div>
                                {m.direction === 'inbound' && <b> {selectedRow.contactName}&nbsp;-&nbsp; </b>}
                                <span className="ts"> {formatTime(m.ts)} </span>
                            </div>
                            <div>
                                {m.message}
                                {m.direction === 'outbound' && getMessageStatusIcon(m.status)}
                            </div>

                        </div>
                </div>
            )}


            <Form ref={form} name="drawer-message">
                <Form.Item  label="" name="message">
                    <TextArea disabled={isLoading}
                              style={{marginTop: 'auto'}}
                              placeholder={isLoading ? 'Sending Message' : 'Write a message'} allowClear
                              onPressEnter={(e) => {
                                  setIsLoading(true);
                                  const value = (e.target as any).value;
                                  console.log(form);
                                  sendMessageFlow(fb, {
                                      recipients:[selectedRow.contactName],
                                      recipientNumbers: [selectedRow.contactNumber],
                                      message:value}, null).then((i) => {
                                      console.log(i);
                                      form.current!.resetFields();
                                  }, (e) => {
                                      console.error(e);
                                  }).finally(() => {setIsLoading(false)})
                              } }/>
                </Form.Item>
            </Form>

        </Drawer>
    </div>);
}

