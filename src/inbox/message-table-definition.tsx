import {ColumnProps} from "antd/lib/table";
import {ITMessage} from "../constants";
import randomTimeStamp from 'random-timestamps';
import randomWords from 'random-words';
import { names } from 'unique-names-generator';
import { timeFormat} from 'd3-time-format';

const formatTime = timeFormat("%B %d, %Y");

export const columns: ColumnProps<ITMessage>[] = [
    {
        title: 'Recipients',
        dataIndex: 'recipients',
        width: '20%'
    },
    {
        title: 'Message',
        dataIndex: 'message',
        ellipsis: true,
        sorter: {
            compare: (a, b) => a.message.localeCompare(b.message),
            multiple: 1
        }
    },
    {
        title: 'sent',
        width: '20%',
        dataIndex: 'timestamp',
        render: (value, record) => formatTime(record.timestamp),
        sorter: {
            compare: (a, b) => a.timestamp - b.timestamp,
            multiple: 2,
        },
    }
];



interface Keyed {
    key: string
}

export function generateFakeData(length: number): (ITMessage & Keyed)[] {
    const a: (ITMessage & Keyed)[] = [];
    for (let i = 0; i < length; i++) {
        const recipients = [names[Math.ceil(Math.random() * names.length)]];
        const message = randomWords({ min: 5, max: 30 }).join(' ');
        const timestamp = randomTimeStamp() * 1000;
        const key = i.toString();
        a.push({key, recipients, message, timestamp});
    }
    return a;
}
