import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

function CreateTip(props) {
    // Create stateful variables
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState();
    const [title, setTitle] = useState();

    // Check if user is signed in and is a nurse
    useEffect(() => {
        const verify = async () => {
            const result = await axios.get("/user/verify");
            if (result.data.user && result.data.user.role === 'nurse') {
                setLoading(false);
            } else {
                window.location.href = "/";
            }
        };

        verify();
    }, []);

    // Event handlers
    const createTip = (e) => {
        e.preventDefault();

        axios.post('/tip/create', {
            'title': title,
            'message': message
        }).then((result) => {
            window.alert("Your motivational tip has been successfully added to the system. Thank you for your submission.");
            setTitle("");
            setMessage("");
        }).catch((err) => {
            window.location.href = "/";
        });
    };

    // Build and return JSX
    return (loading ? <div></div> :
        <div className="flex-container">
            <h1>Submit a Motivational Tip</h1>
            <p>Motivate patients by submitting healthy living and fitness or other motivational tips.</p>
            <hr />

            <form onSubmit={createTip}>
                <table><tbody>
                    <tr>
                        <td>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter title here" required />
                        </td>
                    </tr>
                    <tr>
                        <td><textarea className="tip-input" value={message} onChange={e => setMessage(e.target.value)} rows="15" placeholder="Write your tip here..." required></textarea></td>
                    </tr>
                </tbody></table>

                <center><input className="btn" type="submit" value="Submit" /></center>
            </form>
        </div>
    );
}

export default withRouter(CreateTip);