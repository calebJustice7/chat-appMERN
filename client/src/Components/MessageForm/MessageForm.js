import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './MessageForm.css';
import $ from 'jquery';

function MessageForm() {

    // const dispatch = useDispatch();
    const convo = useSelector(state => state.activeConversation);
    const user = useSelector(state => state.user);
    const [message, setMessage] = useState('');

    const sendMessage = (e) => {
        e.preventDefault();
        let body = JSON.stringify({
            sentFrom_id: user._id,
            message: message,
            _id: convo._id
        });
        let h = new Headers();
        h.append('Content-Type', 'application/json');
        let req = new Request('http://localhost:9000/chat/add-message', {
            method: 'POST',
            headers: h,
            mode: 'cors',
            body: body
        });

        fetch(req)
            .then((response) => {
                response.json().then((result) => {
                    setTimeout(() => { $("#chat-wrapper").scrollTop($("#chat-wrapper")[0].scrollHeight); }, 350)
                    setMessage('');
                })
            })
    }

    return (
        <div className="message__form">
            <div className="send-message-form">
                {convo.names.length == 1 ? <div></div> :
                    <form onSubmit={sendMessage}>
                        <input onChange={e => setMessage(e.target.value)} value={message} placeholder="add message" />
                        <button type="submit">Send</button>
                    </form>
                }
            </div>
        </div>
    )
}

export default MessageForm;