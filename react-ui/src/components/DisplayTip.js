import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

function DisplayTip(props) {
    // Create stateful variables
    const [tip, setTip] = useState();

    // Fetch a random tip
    useEffect(() => {
        const fetchTip = async () => {
            const result = await axios.get("/tip/random");
            if (result.data.tip) {
                setTip(result.data.tip);
            } else {
                window.alert("We unfortunately do not have any tips for you right now. Please come back at a later time.");
                window.location.href = "/";
            }
        };

        fetchTip();
    }, []);

    // Build and return JSX
    return (tip ?
        <div className="flex-container">
            <h1>{tip.title}</h1>
            <span className="tip-author">by <a href={"/user/" + tip.author._id} >{tip.author.fullName}</a></span>
            <i>{tip.datePosted}</i>
            <hr />
            <div className="tip">
                <p>{tip.message}</p>
            </div>
        </div> :
        <div></div>
    );
}

export default withRouter(DisplayTip);