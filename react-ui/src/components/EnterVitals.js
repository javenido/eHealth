import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

function EnterVitals(props) {
    // Create stateful variables
    const [message, setMessage] = useState();
    const [user, setUser] = useState();
    const [vitals, setVitals] = useState({
        patient: '',
        temp: '',
        hRate: '',
        sbp: '',
        dbp: '',
        rRate: '',
        weight: ''
    });

    // Check if user is signed in
    useEffect(() => {
        const verify = async () => {
            const result = await axios.get("/user/verify");
            if (result.data.user) {
                setUser(result.data.user);
            } else
                window.location.href = "/";
        };

        verify();
    }, []);

    // Update patient info when user is verified
    useEffect(() => {
        if (user) {
            if (user.role === "patient") {
                setVitals({ ...vitals, patient: user.username });
            }
        }
    }, [user])

    // Event handlers
    const onChange = (e) => {
        e.persist();
        setVitals({ ...vitals, [e.target.name]: e.target.value });
    };

    const enterVitals = (e) => {
        e.preventDefault();

        const resetForm = () => {
            setVitals({
                patient: user.role === "patient" ? vitals.patient : '',
                temp: '',
                hRate: '',
                sbp: '',
                dbp: '',
                rRate: '',
                weight: ''
            });
            setMessage(null);
        };

        axios.post("/vitals/create", vitals).then((result) => {
            window.alert("Vital signs reading successfully saved.");
            resetForm();
        }).catch((err) => {
            setMessage(err.response.data.message);
        });
    };

    // Build and return JSX
    return (user ?
        <div className="flex-container">
            {message && <span className="error">{message}</span>}

            <h1>Enter Vital Signs</h1>
            <form onSubmit={enterVitals}>
                <table><tbody>
                    <tr>
                        <td align="right" colSpan="4">Patient:</td>
                        {user.role === "patient" ?
                            <td colSpan="2"><input type="text" name="patient" value={vitals.patient} onChange={onChange} disabled /></td> :
                            <td colSpan="2"><input type="text" name="patient" value={vitals.patient} onChange={onChange} placeholder="Enter patient username" required /></td>
                        }

                    </tr>

                    <tr><td colSpan="6"><hr /></td></tr>

                    <tr>
                        <td align="right" colSpan="4">Temperature (°C):</td>
                        <td colSpan="2"><input type="number" name="temp" value={vitals.temp} onChange={onChange} required /></td>
                    </tr>

                    <tr>
                        <td align="right" colSpan="4">Heart Rate (bpm):</td>
                        <td colSpan="2"><input type="number" name="hRate" value={vitals.hRate} onChange={onChange} required /></td>
                    </tr>

                    <tr>
                        <td align="right" colSpan="4">Blood Pressure (mmHg):</td>
                        <td colSpan="1"><input type="number" name="sbp" value={vitals.sbp} onChange={onChange} required placeholder="Systolic" /></td>
                        <td colSpan="1"><input type="number" name="dbp" value={vitals.dbp} onChange={onChange} required placeholder="Diastolic" /></td>
                    </tr>

                    <tr>
                        <td align="right" colSpan="4">Respiratory Rate (br/min):</td>
                        <td colSpan="2"><input type="number" name="rRate" value={vitals.rRate} onChange={onChange} required /></td>
                    </tr>

                    <tr>
                        <td align="right" colSpan="4">Weight (kg):</td>
                        <td colSpan="2"><input type="number" name="weight" value={vitals.weight} onChange={onChange} required /></td>
                    </tr>
                </tbody></table>
                <center><input className="btn" type="submit" value="Submit" /></center>
            </form>
        </div> :
        <div></div>
    );
}

export default withRouter(EnterVitals);