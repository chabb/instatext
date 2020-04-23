import React, {useEffect, useState} from 'react'
import {Table, Input, Drawer} from "antd";
import {columns, generateFakeData} from "./message-table-definition";

const { Search } = Input;
export const Inbox = () => {
    const [isDrawerVisible, setDrawerVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);

    const [data, setData] = useState(generateFakeData(10));
    useEffect(() => { }, []); // potentially load there
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
               dataSource={data}
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

