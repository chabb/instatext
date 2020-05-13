import {ColumnProps} from "antd/lib/table";
import {ITMessage} from "../constants";
import randomTimeStamp from 'random-timestamps';
import randomWords from 'random-words';
import { names } from 'unique-names-generator';
import { timeFormat} from 'd3-time-format';
import React from 'react';
import { CloseCircleOutlined, CheckOutlined, DashOutlined, QuestionCircleOutlined, RollbackOutlined} from '@ant-design/icons';
import {SmsAttributes} from "twilio/lib/twiml/VoiceResponse";

const formatTime = timeFormat("%B %d, %Y");

export const columns: ColumnProps<ITMessage>[] = [
    {
        title: 'sent',
        width: '20%',
        dataIndex: 'createdAt',
        render: (value, record) => formatTime(record.ts),
        sorter: {
            compare: (a, b) => a.ts - b.ts,
            multiple: 2,
        },
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
        title: 'Recipient',
        dataIndex: 'to',
        width: '20%',
        render: (value, record: any) => record.direction === 'inbound' ? record.from : record.to
    },
    {
        title: 'Status',
        dataIndex: 'status',
        width: '10%',
        render: (value, record: any) => getIcon(value)

    },

];

function getIcon(value) {
    if (value === 'queued') {
        return <DashOutlined />
    }
    if (value === 'sent') {
        return <CheckOutlined/>
    }
    if (value === 'undelivered') {
        return <CloseCircleOutlined />
    }
    if (value === 'delivered') {
        return (<>
            <CheckOutlined />
            <CheckOutlined />
            </>);

    }
    if (value === 'received') {
        return (<>
            <RollbackOutlined />
            <CheckOutlined />
        </>);

    }
    if (value === 'failed') {
        return <CloseCircleOutlined />
    }
   return <QuestionCircleOutlined/>
}

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

        //a.push({key, recipients, message, timestamp});
    }
    return a;
}
