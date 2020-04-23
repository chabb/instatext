import React, {useEffect, useState} from 'react'
import {Table, Input} from "antd";
import {columns, generateFakeData} from "./message-table-definition";

const { Search } = Input;
export const Inbox = () => {
    const [data, setData] = useState(generateFakeData(10));
    useEffect(() => { }, []); // potentially load there
    return (
    <div className='inbox'>
        <Search
            placeholder="input search text"
            enterButton="Search"
            size="large"
            onSearch={value => console.log(value)}/>
        <Table columns={columns} dataSource={data} onChange={() => {}} />
    </div>);
}

