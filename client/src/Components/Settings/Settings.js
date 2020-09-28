import React from 'react';
import './Settings.css';
import $ from 'jquery';
import { useHistory } from 'react-router-dom';

function Settings() {

    const history = useHistory();

    const close = () => {
        $('#settings-page').fadeOut(400);
    }

    const signOut = () => {
        localStorage.removeItem('user');
        setTimeout(() => {
            history.push('/');
        },500)
    }

    return (
        <div id="settings-page" className="settings-page">
            <div className="settings-content">
                <i onClick={close} className="fas fa-times"></i>
                <button onClick={signOut}>Sign out</button>
            </div>
        </div>
    )
}

export default Settings;