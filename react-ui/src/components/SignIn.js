import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

function SignIn(props) {
    // Create stateful variables
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState();
    const [password, setPassword] = useState();
    const [signedIn, setSignedIn] = useState();
    const [username, setUsername] = useState();

    // Check if a user is already signed in
    useEffect(() => {
        const verify = async () => {
            const result = await axios.get("/user/verify");
            setSignedIn(result.data.user);
            setLoading(false);
        };

        verify();
    }, []);

    // Event handlers
    const signIn = (e) => {
        e.preventDefault();
        const data = { username: username, password: password };
        axios.post("/user/login", data).then(() => {
            window.location.href = "/";
        }).catch((err) => {
            setMessage(err.response.data.message);
        });
    };

    // Build and return JSX
    return (
        loading ? <div></div> : // if loading don't display anything
            signedIn ? <Redirect push to="/" /> : // if signed in, redirect to home page

                // login form
                <div className="flex-container">
                    {message && <span className="error">{message}</span>}

                    <h1>Sign in to your account</h1>
                    <form onSubmit={signIn}>
                        <table><tbody>
                            <tr>
                                <td align="right">Username:</td>
                                <td><input type="text" id="username" onChange={e => setUsername(e.target.value)} required /></td>
                            </tr>
                            <tr>
                                <td align="right">Password:</td>
                                <td><input type="password" id="password" onChange={e => setPassword(e.target.value)} required /></td>
                            </tr>
                            <tr>
                                <td colSpan="2"><center><input className="btn" type="submit" value="Sign In" /></center></td>
                            </tr>
                        </tbody></table>
                    </form>

                    <p className="here">Don't have an account? Click <a href="/signup">here</a> to sign up.</p>
                </div>
    );
}

export default withRouter(SignIn);