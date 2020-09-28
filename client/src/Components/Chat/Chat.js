import React from 'react';
import { useSelector } from 'react-redux';
import './Chat.css';
import Settings from '../Settings/Settings';

function Chat() {

    const convo = useSelector(state => state.activeConversation);
    const user = useSelector(state => state.user);

    const getDate = (date) => {
        let newDate = new Date(date);
        let min = newDate.getMinutes();
        let hour = newDate.getHours();
        return `${hour > 12 ? hour - 12 : hour}:${min}`
    }

    return (
        <>
            <Settings />
            <div className="chat__wrapper" id="chat-wrapper">
                <div className="home__conversationHeader">
                    <div></div>
                    <div className="home__conversationHeaderRight">
                        <span className="user-display-name">{user.firstName + ' ' + user.lastName}</span>
                    </div>
                </div>
                <div className="messages" id="messages">
                    {convo.messages.map((msg, idx) => (
                        <div key={idx} className={msg.sentFrom == user._id ? 'chat-sent' : 'chat-received'}>
                            <div className="chat-message">{msg.message}</div>
                            <div className="chat-date">{getDate(msg.date)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Chat;