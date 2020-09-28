import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import errorMessage from '../../helpers/errorMessage';
import './Signup.css';
import $ from 'jquery';

function Signup() {

    const history = useHistory();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    
    useEffect(() => {
        $('#signup-main').hide(0);
        $('#signup-main').slideDown(1000);
    }, [])

    const returnToSignIn = () => {
        history.push('/');
    }

    const capitalizeFirst = (str) => {
        if(str.length == 0) return str;
        return str[0].toUpperCase() + str.substring(1)
    }

    const register = (e) => {
        e.preventDefault();
        let body = JSON.stringify({
            firstName: capitalizeFirst(firstName),
            lastName: capitalizeFirst(lastName),
            email,
            password
        });
        let h = new Headers();
        h.append("Content-Type", "application/json");
        let req = new Request('http://localhost:9000/users/register', {
            method: "POST",
            headers: h,
            mode: "cors",
            body: body
        });
        fetch(req)
            .then((response) => {
                response.json().then((result) => {
                    if(result.success === 'true'){
                        returnToSignIn();
                    } else {
                        setMessage(errorMessage(result))
                    }
                })
            })
    }

    return (
        <>
            <div className="signup" id="signup">
                <div className="signup__main" id="signup-main">
                    <form onSubmit={register}>
                        <h1>Sign Up</h1>
                        <div className="signup__form">
                            <input type="text" placeholder="Enter your First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>

                        <div className="signup__form">
                            <input type="text" placeholder="Enter your Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                        </div>

                        <div className="signup__form">
                            <input type="text" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>

                        <div className="signup__form">
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <div className="message">{message}</div>
                        <div className="signup__button">
                            <button type="submit">Sign Up</button>
                            <div onClick={returnToSignIn}>Back to sign up</div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Signup;