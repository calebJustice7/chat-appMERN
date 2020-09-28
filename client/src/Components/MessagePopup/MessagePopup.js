import React from 'react';
import './MessagePopup.css';

function MessagePopup(props){
    return (
        <div className="message-popup">
            <div className="message-content">
                {props.message}
            </div>
        </div>
    )
}

export default MessagePopup;