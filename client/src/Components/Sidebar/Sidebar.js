import React from 'react';
import './Sidebar.css';
import { useSelector, useDispatch } from 'react-redux';
import $ from 'jquery';

function Sidebar(props) {

    const user = useSelector(state => state.user);
    const activeConversation = useSelector(state => state.activeConversation);
    const fullName = `${user.firstName} ${user.lastName}`;
    const dispatch =  useDispatch();

    const showName = (name) => {
        let newNameArr = name.filter(userName => {
            return userName != fullName
        })
        if(newNameArr.length === 0) {
            return name[0];
        } else {
            return newNameArr[0];
        }
    }

    const deleteChat = (conv) => {
        let body = JSON.stringify({
            _id: conv._id
        });
        let h = new Headers();
        h.append('Content-Type', 'application/json');
        let req = new Request('http://localhost:9000/chat/delete-chat', {
            method: 'POST',
            headers: h,
            mode: 'cors',
            body: body
        });

        fetch(req)
            .then((response) => {
                response.json().then((result) => {
                    // window.location.reload();
                })
            })
    }

    const selectConvo = (conv) => {
        let body = JSON.stringify({
            _id: conv._id
        });
        let h = new Headers();
        h.append('Content-Type', 'application/json');
        let req = new Request('http://localhost:9000/chat/get-chat', {
            method: 'POST',
            headers: h,
            mode: 'cors',
            body: body
        });

        fetch(req)
            .then((response) => {
                response.json().then((result) => {
                    if(result.message != 'success') {
                        dispatch({type: "REFRESH"})
                    }
                    else {
                        dispatch({
                            type: 'SELECT_CONVO',
                            conversation: result.data
                        })
                        $("#chat-wrapper").scrollTop($("#chat-wrapper")[0].scrollHeight);
                    }
                })
            })
    }

    return (
        <div className="sidebar__chats">
            {props.conversations.map((conv, idx) => (
                <div className={conv._id === activeConversation._id ? 'active-chat conversation' : 'conversation'} key={idx}>
                    <img onClick={() => selectConvo(conv)} src="https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png" />
                    <div className="chat__info">
                        <div className="chat__name">{showName(conv.names)}</div>
                    </div>
                    <i onClick={() => deleteChat(conv)} className="far fa-trash-alt"></i>
                </div>
            ))}
        </div>
    )
}

export default Sidebar;