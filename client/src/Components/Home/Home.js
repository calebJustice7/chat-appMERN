import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import auth from '../../helpers/auth';
import './Home.css';
import Pusher from 'pusher-js';
import jwt from '../../helpers/auth';
import Modal from '../Modal/Modal';
import $ from 'jquery';
import Sidebar from '../Sidebar/Sidebar';
import Chat from '../Chat/Chat';
import MessageForm from '../MessageForm/MessageForm';

function Home() {

    const user = useSelector(state => state.user);
    const [users, setUsers] = useState([]);
    const dispatch = useDispatch();
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const pusher = new Pusher('6d254b816f97f709f504', {
            cluster: 'us2'
          });

          const channel = pusher.subscribe('messages');
          channel.bind('inserted', function(data) {
            dispatch({
                type: "ADD_MESSAGE",
                message: data
            })
          });

          const channelTwo = pusher.subscribe('conversation');
          channelTwo.bind('inserted', function(data) {
            setConversations(old => [...old, data]);
          })

          const channelThree = pusher.subscribe('deleteConvo');
          channelThree.bind('deleted', function(data) {
            let con = conversations;
            con.filter(conv => {
                return conv._id != data._id
            });
            setConversations(con);
          })
          getChats();
    }, [])

    const showModal = () => {
        $('#modal').fadeIn(500);
        getUsers();
    }

    const getChats = () => {
        if(!jwt()) {
            console.log('Not authorized');
            return;
        }
        let token = JSON.parse(localStorage.getItem('user'));
        let h = new Headers();
        h.append('Content-Type', 'application/json');
        h.append('Authorization', token.token);
        let req = new Request('http://localhost:9000/chat/get-chats', {
            method: 'POST',
            headers: h,
            mode: 'cors',
            body: JSON.stringify({
                _id: token.user._id
            })
        });


        fetch(req)
            .then((response) => {
                response.json().then((result) => {
                    setConversations(result);
                })
            })
    }

    const getUsers = () => {
        if(!jwt()) {
            console.log('Not authorized');
            return;
        }
        let token = JSON.parse(localStorage.getItem('user')).token;
        let h = new Headers();
        h.append('Content-Type', 'application/json');
        h.append('Authorization', token);
        let req = new Request('http://localhost:9000/users/get-all-users', {
            method: 'POST',
            headers: h,
            mode: 'cors',
            body: JSON.stringify({
                email: user.email
            })
        });

        fetch(req)
            .then((response) => {
                response.json().then((result) => {
                    setUsers(result);
                })
            })
    }

    const showSettings = () => {
        $('#settings-page').fadeIn(500);
    }

    return (
        user && auth() ?
        <>
            <div className="home">
                <div className="home__content">
                    <div className="home__sidebar">
                        <div className="sidebar__header">
                            Insta-Chat <i onClick={showSettings} className="fas fa-cog"></i>
                        </div>
                        <div className="sidebar__conversation">
                            <div>Conversations</div>
                            <i onClick={showModal} className="fas fa-plus"></i>
                        </div>
                        <Sidebar getChats={getChats} conversations={conversations}/>
                    </div>
                    <div className="home__conversation" id="home-convo">
                        <Chat />
                        <MessageForm />
                    </div>
                </div>
            </div>
            <Modal users={users}/>
        </>
        :
        <div>
            <h1>Not logged in</h1>
        </div>
    )
}

export default Home;