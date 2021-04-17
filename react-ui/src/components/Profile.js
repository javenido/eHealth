import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

function Profile(props) {
    // Create stateful variables
    const [user, setUser] = useState();

    // Retrieve user
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get("/user/" + props.match.params.id);
            setUser(result.data.user);
        };

        fetchData();
    }, []);

    // Build and return JSX
    return (user ?
        <div className="flex-container">
            <h1>{user.fullName}</h1>
            <hr />

            <div className="profile">

                <div className="profile-card">
                    <h2>Basic Information</h2>

                    <KeyValue k="Full Name" v={user.fullName} />
                    <KeyValue k="Age" v={user.age} />
                    <KeyValue k="Gender" v={user.gender} />
                    <KeyValue k="Birth Date" v={user.birthdate} />
                    <KeyValue k="Address" v={user.fullAddress} />
                </div>

                <div className="profile-card">
                    <h2>Account Information</h2>

                    <KeyValue k="Username" v={user.username} />
                    <KeyValue k="Account Type" v={user.role[0].toUpperCase() + user.role.substring(1)} />

                    <h2>Contact Information</h2>

                    <KeyValue k="Phone Number" v={user.phoneNumber} />
                    <KeyValue k="Email Address" v={user.email} />
                </div>
            </div>
        </div> :
        <div></div>
    );
}

export default withRouter(Profile);

function KeyValue(props) {
    return (
        <div className="key-pair">
            <span>{props.k}</span>
            <span>{props.v}</span>
        </div>
    );
}