import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

function SignUp(props) {
    // Create stateful variables
    const [confirmationPassword, setConfirmationPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState();
    const [signedIn, setSignedIn] = useState();
    const [user, setUser] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        birthday: '',
        gender: '',
        address: '',
        city: '',
        province: '',
        phoneNumber: '',
        email: '',
        role: props.role ? props.role : ''
    });

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
    const onChange = (e) => {
        e.persist();
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const createAccount = (e) => {
        e.preventDefault();

        if (user.password === confirmationPassword) {
            axios.post("/user/create", user).then((result) => {
                window.location.href = "/";
            }).catch((err) => {
                setMessage(err.response.data.message);
            });
        } else {
            setMessage('Password and confirmation password do not match');
        }
    };

    // Build and return JSX
    return (
        loading ? <div></div> : // if loading don't display anything
            signedIn ? <Redirect to="/" /> : // if signed in, redirect to home page

                user.role === '' ?
                    // select role
                    (<div className="flex-container">
                        <h1>Select Account Type</h1>
                        <div>
                            <select name="role" onChange={onChange}>
                                <option value="">Choose a role</option>
                                <option value="nurse">Nurse</option>
                                <option value="patient">Patient</option>
                            </select>

                            <p className="here"> Already have an account? Click <a href="/signin">here</a> to sign in.</p>
                        </div>
                    </div>) :

                    // registration form
                    (<div className="flex-container">
                        {message && <span class="error">{message}</span>}

                        <h1>Create a {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Account</h1>
                        <form onSubmit={createAccount}>
                            <table><tbody>
                                <tr><td><b>Account Details</b></td></tr>
                                <tr>
                                    <td>
                                        <input type="text" name="username" id="username" value={user.username} onChange={onChange} required
                                            placeholder="Choose a username" />
                                        <label>Username</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input type="password" name="password" id="password" value={user.password} onChange={onChange} required
                                            pattern=".{7,}" title="Password should be longer than 6 characters" />
                                        <label>Password</label>
                                    </td>
                                    <td>
                                        <input type="password" value={confirmationPassword} onChange={e => setConfirmationPassword(e.target.value)} required />
                                        <label>Confirm Password</label>
                                    </td>
                                </tr>

                                <tr><td><b>Personal Details</b></td></tr>
                                <tr>
                                    <td>
                                        <input type="text" name="firstName" id="firstName" value={user.firstName} onChange={onChange} required />
                                        <label>First Name</label>
                                    </td>
                                    <td>
                                        <input type="text" name="lastName" id="lastName" value={user.lastName} onChange={onChange} required />
                                        <label>Last Name</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input name="birthday" type="date" onChange={onChange} required />
                                        <label>Birth Date</label>
                                    </td>
                                    <td>
                                        <select name="gender" onChange={onChange} required>
                                            <option value="">Select one</option>
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                        <label>Gender</label>
                                    </td>
                                </tr>

                                <tr><td><b>Address</b></td></tr>
                                <tr>
                                    <td colSpan="2">
                                        <input type="text" name="address" id="address" value={user.address} onChange={onChange} required />
                                        <label>Street Address</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input type="text" name="city" id="city" value={user.city} onChange={onChange} required />
                                        <label>City</label>
                                    </td>
                                    <td>
                                        <select name="province" onChange={onChange} required >
                                            <option value="">Select one</option>
                                            <option>Alberta</option>
                                            <option>British Columbia</option>
                                            <option>Manitoba</option>
                                            <option>New Brunswick</option>
                                            <option>Newfoundland and Labrador</option>
                                            <option>Nova Scotia</option>
                                            <option>Ontario</option>
                                            <option>Prince Edward Islan</option>
                                            <option>Quebec</option>
                                            <option>Saskatchewan</option>
                                            <option>Northwest Territories</option>
                                            <option>Nunavut</option>
                                            <option>Yukon</option>
                                        </select>
                                        <label>Province/Territory</label>
                                    </td>
                                </tr>

                                <tr><td><b>Contact Details</b></td></tr>
                                <tr>
                                    <td>
                                        <input type="text" name="phoneNumber" id="phoneNumber" value={user.phoneNumber} onChange={onChange} required
                                            pattern="[0-9]+" title="Please enter numeric characters only" />
                                        <label>Phone Number</label>
                                    </td>
                                    <td>
                                        <input type="email" name="email" id="email" value={user.email} onChange={onChange} required />
                                        <label>Email Address</label>
                                    </td>
                                </tr>
                            </tbody></table>

                            <center><input className="btn" type="submit" value="Create Account" /></center>
                        </form>
                    </div>)
    );
}

export default withRouter(SignUp);