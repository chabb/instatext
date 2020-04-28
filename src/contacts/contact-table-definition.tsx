import {ColumnProps} from "antd/lib/table";
import { timeFormat} from 'd3-time-format';
import {ITMessage} from "../constants";
import {names} from "unique-names-generator";
import randomTimeStamp from 'random-timestamps';

const formatTime = timeFormat("%B %d, %Y");

export interface ITContact {
    createdAt: number,
    contact: string,
    phoneNumber: string,
}

export const columns: ColumnProps<ITContact>[] = [
    {
        title: 'Contact',
        dataIndex: 'contact',
        width: '20%'
    },
    {
        title: 'Phone number',
        dataIndex: 'phoneNumber',
        ellipsis: true,
        sorter: {
            compare: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
            multiple: 1
        }
    },
    {
        title: 'Created at',
        width: '20%',
        dataIndex: 'createdAt',
        render: (value, record) => formatTime(record.createdAt),
        sorter: {
            compare: (a, b) => a.createdAt - b.createdAt,
            multiple: 2,
        },
    }
];


interface Keyed {
    key: string
}

export function generateFakeData(length: number): (ITContact & Keyed)[] {
    const a: (ITContact & Keyed)[] = [];
    for (let i = 0; i < length; i++) {
        const contact = names[Math.ceil(Math.random() * names.length)];
        const phoneNumber = '' + 1000000 + Math.floor(Math.random() * 9000);
        const timestamp = randomTimeStamp() * 1000;
        const key = i.toString();
        a.push({key, contact, phoneNumber, createdAt: timestamp});
    }
    return a;
}

