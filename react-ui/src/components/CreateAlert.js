import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

function CreateAlert(props) {
    // Create stateful variables
    const [alert, setAlert] = useState();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState();

    // Check if user is signed in and is a patient
    useEffect(() => {
        const verify = async () => {
            const result = await axios.get("/user/verify");
            if (result.data.user && result.data.user.role === 'patient') {
                setLoading(false);
            } else
                window.location.href = "/";
        };

        verify();
    }, []);

    // Event handlers
    const createAlert = (e) => {
        e.preventDefault();

        if (!alert || alert === '') {
            setMessage("Please describe your emergency below");
        } else {
            axios.post('/alert/create', { 'alert': alert }).then((result) => {
                window.alert("Emergency alert received.\n\nWe will assess your emergency as quickly as we can and react accordingly.");
                setAlert("");
                setMessage(null);
            }).catch((err) => {
                setMessage(err.response.data.message);
            });
        }
    }

    // Build and return JSX
    return (loading ? <div></div> :
        <div className="flex-container">
            {message && <span className="error">{message}</span>}

            <h1>Emergency Alert System</h1>
            <hr />
            <h2>Tell us what's wrong, and we'll get back to you as soon as possible.</h2>

            <textarea className="alert" value={alert} onChange={e => setAlert(e.target.value)} rows="10" placeholder="Describe your emergency..."></textarea>
            <button className="btn alert-btn" onClick={createAlert}>Create Alert</button>
        </div>
    );
}

export default withRouter(CreateAlert);