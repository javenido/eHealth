import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

function ListVitals(props) {
    // Create stateful variables
    const [data, setData] = useState();
    const [patient, setPatient] = useState();
    const [user, setUser] = useState();

    // Check if user is signed in and retrieve vitals
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('/vitals/list' + (props.match.params.patient ? '/' + props.match.params.patient : ''));
            const vitals = result.data.vitals;
            setPatient(result.data.patient);
            function compare(a, b) {
                if (a.patient.fullName < b.patient.fullName) {
                    return -1;
                }
                if (a.patient.fullName < b.patient.fullName) {
                    return -1;
                }
                return 0;
            }
            setData(vitals.sort(compare));
        };

        const verify = async () => {
            const result = await axios.get("/user/verify");
            if (result.data.user) {
                setUser(result.data.user);
                fetchData();
            } else {
                window.location.href = "/signin";
            }
        };

        verify();
    }, []);

    // Build and return JSX
    return (data ?
        <div className="flex-container">
            <h1>Vital Signs Readings</h1>
            {patient ?
                <p>
                    Listing the most recent vital signs readings of <a href={"/user/" + patient._id}>{patient.fullName}</a>.
                    {user.role==='nurse' ? <span> Click <a href="/vitals/list">here</a> to view all.</span> : ""}
                </p> :
                <p>This table lists the most recent vital signs readings sorted by patient name.</p>}
            <hr />

            <table className="data">
                <thead>
                    <tr>
                        <th>Patient</th>
                        <th>Added by</th>
                        <th>Temperature (°C)</th>
                        <th>Heart Rate (bpm)</th>
                        <th>Blood Pressure (mmHg)</th>
                        <th>Respiratory Rate (br/min)</th>
                        <th>Weight (kg)</th>
                        <th>Date Recorded</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? data.map((vitals, idx) => (
                        <tr key={idx}>
                            <td><a href={"/vitals/list/" + vitals.patient.username} title="View readings of this patient only">{vitals.patient.fullName}</a></td>
                            <td><a href={"/user/" + vitals.addedBy._id}>{vitals.addedBy.fullName}</a></td>
                            <td align="center">{vitals.temp}</td>
                            <td align="center">{vitals.hRate}</td>
                            <td align="center">{vitals.bp}</td>
                            <td align="center">{vitals.rRate}</td>
                            <td align="center">{vitals.weight}</td>
                            <td>{vitals.dateRecorded}</td>
                        </tr>
                    )) :
                        <tr>
                            <td colSpan="8"><center>No records found.</center></td>
                        </tr>
                    }
                </tbody>
            </table>

            <a className="btn" href="/vitals/new">Add new entry</a>
        </div> :
        <div></div>);
}

export default withRouter(ListVitals);