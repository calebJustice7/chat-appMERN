import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import errorMessage from '../../helpers/errorMessage';
import './Signin.css';
import $ from 'jquery';

function Signup() {

    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        $('#signin').hide();
        $('#signin-main').hide();
        setTimeout(() => { $('#signin-welcome').fadeOut(1700); }, 1500, () => { });
        setTimeout(() => { $('#signin').fadeIn(2000); }, 2500);
        setTimeout(() => { $('#signin-main').slideDown(1000); }, 4000, () => { });
    }, [])

    const changeToSignUp = () => {
        $('#signin-main').slideUp(1000, () => {
            history.push('/signup')
        })
    }

    const changeToHome = () => {
        history.push('/home');
    }

    const validate = (result) => {
        if (result.user && result.token) {
            localStorage.setItem('user', JSON.stringify({
                token: result.token,
                user: result.user
            }));
            dispatch({
                type: 'LOGIN',
                user: result.user
            });
            changeToHome();
        }
    }

    const login = (e) => {
        e.preventDefault();
        let body = JSON.stringify({
            email,
            password
        });
        let h = new Headers();
        h.append('Content-Type', 'application/json');
        let req = new Request('http://localhost:9000/users/login', {
            method: 'POST',
            headers: h,
            mode: 'cors',
            body: body
        });

        fetch(req)
            .then((response) => {
                response.json().then((result) => {
                    if (result.success == true) {
                        validate(result);
                    } else {
                        setMessage(errorMessage(result));
                    }
                })
            })
    }

    return (
        <>
            <div className="signin__welcome" id="signin-welcome">
                <div className="signin__welcomeContent">
                    <h1>Welcome...</h1>
                    <div>Created by Caleb Justice</div>
                </div>
            </div>
            <div className="signin" id="signin">
                <div className="signin__main" id="signin-main">
                    <form onSubmit={login}>
                        <h1>Sign In</h1>
                        <div className="signin__form">
                            <input type="text" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className="signin__form">
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="message">{message}</div>
                        <div className="signin__button">
                            <button type="submit">Sign In</button>
                            <div onClick={changeToSignUp}>Dont have an account? click here</div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Signup;