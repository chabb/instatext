import React from 'react'


const isMessageOwner = (m) => true;

export const Chat: React.FC<any> = ({messages}) => {
    return <div className='chat'>
        {(messages as any[]).map(m => <div>
            {isMessageOwner(m) ? <MessageFrom message={m}/> : <MessageTo message={m}/>}

        </div>)}
    </div>
};


const MessageFrom = (props) => <div></div>;
const MessageTo = (props) => <div></div>;
