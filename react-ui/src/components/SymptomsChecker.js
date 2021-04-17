import axios from 'axios';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

function SymptomsChecker(props) {
    // Create stateful variables
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState();
    const [symptoms, setSymptoms] = useState({
        genetic: 4,
        obesity: 4,
        smoking: 4,
        weight: 4,
        swallowing: 4,
        cough: 4
    });

    // Event handlers
    const handleOnSubmit = (event) => {
        setLoading(true);

        const start = new Date() / 1000;
        axios.post('/predict', symptoms).then((result) => {
            const end = new Date() / 1000;
            var risk, advice;
            var max = 0;
            for (var i = 1; i < result.data.length; i++) {
                if (result.data[i] > result.data[max]) {
                    max = i;
                }
            }

            if (max === 0) {
                risk = "High";
                advice = "There is a high chance that you have lung cancer. " +
                    "We recommend that you visit a healthcare provider as soon as possible " +
                    "so you can start treatment immediately in the worst case scenario that you actually have lung cancer."
            } else if (max === 1) {
                risk = "Medium";
                advice = "There is a moderate chance that you may have lung cancer. We advice that you visit a healthcare provider soon so they can examine your situation.";
            } else {
                risk = "Low";
                advice = "Congratulations. There is a low chance that you have lung cancer.";
            }

            setResults({
                risk: risk,
                advice: advice,
                duration: end - start,
                date: new Date().toLocaleString()
            });

            setLoading(false);
        });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSymptoms((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Resets the form
    const reset = function () {
        setResults(null);
        setSymptoms({
            genetic: 4,
            obesity: 4,
            smoking: 4,
            weight: 4,
            swallowing: 4,
            cough: 4
        });
    };

    return (loading ? // loading
        <div className="flex-container">
            <h1>Lung Cancer Symptoms Checker</h1>
            <p>Calculating the result. This process usually takes less than a minute.</p>
            <hr />
            <div className="spinner"></div>
        </div> : results ? // not loading, with results
            <div className="flex-container">
                <h1>Lung Cancer Symptoms Checker</h1>
                <p>Here are the results.</p>
                <hr />
                <div className="lcsc flex-container">
                    <div className="lcsc-input">
                        <b>Severity of Symptoms:</b>
                        <ul>
                            <li>Genetic Risk: {symptoms.genetic}</li>
                            <li>Obesity: {symptoms.obesity}</li>
                            <li>Smoking: {symptoms.smoking}</li>
                            <li>Weight Loss: {symptoms.weight}</li>
                            <li>Swallowing Difficulty: {symptoms.swallowing}</li>
                            <li>Dry Cough: {symptoms.cough}</li>
                        </ul>
                    </div>
                    <h2>Result:</h2>
                    <div className={"lcsc-result lcsc-result-" + results.risk}>{results.risk}</div>
                    <p>{results.advice}</p>
                    <span>Calculation Time: {(results.duration).toFixed(1)} seconds</span>
                    <span>Date: {results.date}</span>
                </div>

                <button className="btn" onClick={reset}>Try Again</button>

            </div> : // not loading, without results
            <div className="flex-container">
                <h1>Lung Cancer Symptoms Checker</h1>
                <p>Worried you might have lung cancer? Indicate the severity of your symptoms below. We'll make an educated prediction of the chances of you having lung cancer,
                    and we'll advise you on what to do next.</p>
                <hr />

                <div className="sliders">
                    <p>Genetic Risk</p>
                    <input type="range" name="genetic" min="1" max="7" value={symptoms.genetic} onChange={handleInputChange} />
                    <div className="slider-ticks">
                        <span>Very Low</span> <span>Medium</span> <span>High</span>
                    </div>

                    <p>Obesity</p>
                    <input type="range" name="obesity" min="1" max="7" value={symptoms.obesity} onChange={handleInputChange} />
                    <div className="slider-ticks">
                        <span>None</span> <span>Mild</span> <span>Moderate</span> <span>Severe</span>
                    </div>

                    <p>Smoking</p>
                    <input type="range" name="smoking" min="1" max="7" value={symptoms.smoking} onChange={handleInputChange} />
                    <div className="slider-ticks">
                        <span>Never</span> <span>Occasionally</span> <span>Very Often</span>
                    </div>

                    <p>Weight Loss</p>
                    <input type="range" name="weight" min="1" max="7" value={symptoms.weight} onChange={handleInputChange} />
                    <div className="slider-ticks">
                        <span>None</span> <span>Mild</span> <span>Moderate</span> <span>Severe</span>
                    </div>

                    <p>Swallowing Difficulty</p>
                    <input type="range" name="swallowing" min="1" max="7" value={symptoms.swallowing} onChange={handleInputChange} />
                    <div className="slider-ticks">
                        <span>None</span> <span>Mild</span> <span>Moderate</span> <span>Severe</span>
                    </div>

                    <p>Dry Cough</p>
                    <input type="range" name="cough" min="1" max="7" value={symptoms.cough} onChange={handleInputChange} />
                    <div className="slider-ticks">
                        <span>None</span> <span>Mild</span> <span>Moderate</span> <span>Severe</span>
                    </div>

                    <center><button className="btn" onClick={handleOnSubmit}>Check</button></center>
                </div>
            </div>
    )
}

export default withRouter(SymptomsChecker);