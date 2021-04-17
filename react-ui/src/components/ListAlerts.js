import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

function ListAlerts(props) {
    // Create stateful variables
    const [data, setData] = useState();

    // Check if user is a registered nurse and then retrieve alerts
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('/alerts/list');
            setData(result.data.alerts);
        };

        const verify = async () => {
            const result = await axios.get("/user/verify");
            if (result.data.user) {
                if (result.data.user.role === 'nurse') {
                    fetchData();
                } else {
                    window.location.href = "/";
                }
            } else {
                window.location.href = "/signin";
            }
        };

        verify();
    }, []);

    // Event handlers
    const resolve = (e) => {
        e.preventDefault();

        if (window.confirm("Are you sure you want to mark this emergency alert as resolved? Once resolved, an alert will be permanently deleted.\n\nClick \"OK\" to proceed."))
            axios.delete("/alert/" + e.target.id).then(() => {
                props.history.go(0);
            });
    }

    // Build and return JSX
    return (data ?
        <div className="flex-container">
            <h1>Emergency Alert System</h1>
            <p>This page lists the most recent emergency alerts submitted by patients.</p>
            <hr />
            {data.length > 0 ?
                data.map(
                    (alert, idx) => (
                        <div className="alert-card" key={idx}>
                            <span><b><a href={'/user/' + alert.patient._id}>{alert.patient.fullName}</a></b> · {alert.age} ago</span>
                            <p>{alert.alertDescription}</p>
                            <a className="alert-resolve" title="Mark as resolved" id={alert._id} onClick={resolve}>✖</a>
                        </div>
                    )
                ) :
                <span>There are no active alerts at the moment.</span>
            }
        </div> :
        <div></div>
    );
}

export default withRouter(ListAlerts);