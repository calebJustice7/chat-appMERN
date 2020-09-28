import React, { useEffect, useState } from 'react';
import './Modal.css';
import { useSelector, useDispatch } from 'react-redux';
import $ from 'jquery';
import MessagePopup from '../MessagePopup/MessagePopup';
import jwt from '../../helpers/auth';

function Modal(props) {

    let user = useSelector(state => state.user);
    const [message, setMessage] = useState('');
    const dispatch = useDispatch();
    const [popup, setPopup] = useState(false);

    useEffect(() => {
        $('#modal').hide();
    },[])

    const hideModal = () => {
        $('#modal').fadeOut(500);
    }

    const startConversation = (data) => {
        if(!jwt()) {
            console.log('Not authorized');
            return;
        }
        let body = JSON.stringify({
            _ids: [user._id, data._id],
            names: [`${user.firstName} ${user.lastName}`, `${data.firstName} ${data.lastName}`]
        });
        let token = JSON.parse(localStorage.getItem('user')).token;
        let h = new Headers();
        h.append('Content-Type', 'application/json');
        h.append('Authorization', token);
        let req = new Request('http://localhost:9000/chat/new-chat', {
            method: 'POST',
            headers: h,
            mode: 'cors',
            body: body
        });

        fetch(req)
            .then((response) => {
                response.json().then((result) => {
                    setMessage(result.message);
                    setPopup(true);
                    if(result.data != 'false'){ 
                        dispatch({
                            type: 'SELECT_CONVO',
                            conversation: result.data
                        })
                    }
                    setTimeout(() => {
                        setMessage('');
                        setPopup(false);
                    },2000)
                })
            })
    }

    return (
        <div className="modal__wrapper" id="modal">
        {popup ? <MessagePopup message={message}/> : ''}
            <div className="modal__content" id="modal-content">
                <div className="users">
                    {props.users.map((user, idx) => (
                        <div className="user" key={idx}>
                            <img alt="avatar logo" src="https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png" />
                            <div className="info">
                                <div className="name">{user.firstName} {user.lastName}</div>
                                <div className="email">{user.email}</div>
                                <div onClick={() => startConversation(user)} className="hover-text">Start conversation</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{'display': props.users.length >= 4 ? 'block': 'none'}} className="scroll-notify"><i className="fas fa-chevron-down"></i></div>
                <i onClick={hideModal} className="fas fa-times"></i>
            </div>
        </div>
    )
}

export default Modal;