const User = require('mongoose').model('User');
const Vitals = require('mongoose').model('Vitals');

// Create a new error handling controller method
function getErrorMessage(err) {
    if (err.errors) {
        for (let errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].
                message;
        }
    } else {
        return 'Unknown server error';
    }
};

// Create a new vitals entry
exports.create = function (req, res) {
    var vitals = new Vitals(req.body);

    User.findOne({ username: req.body.patient, role: "patient" }, (err, patient) => {
        if (err) {
            return res.status(400).json({ message: getErrorMessage(err) });
        } else if (!patient) {
            return res.status(400).json({ message: "Patient does not exist" });
        } else {
            vitals.addedBy = req.userId;
            vitals.patient = patient._id;
            vitals.save((err) => {
                if (err) {
                    return res.status(400).json({ message: getErrorMessage(err) });
                } else {
                    return res.status(200).end();
                }
            });
        }
    });
};

// Send all vitals or by of a patient
exports.list = async function (req, res) {
    var patient;
    if (req.params.patient) {
        patient = await User.findOne({ username: req.params.patient });
    }

    const query = patient ? { patient: patient._id } : {};

    Vitals.find(query)
        .populate('addedBy')
        .populate('patient')
        .sort({ date: -1 })
        .exec((err, vitals) => {
            if (err) {
                return res.status(400).end();
            }
            return res.status(200).send({ vitals: vitals, patient: patient });
        });
};

// Predict the risk level of developing lung cancer
exports.trainAndPredict = function (req, res) {
    const tf = require('@tensorflow/tfjs');
    require('@tensorflow/tfjs-node');

    // load training data
    const data = require('../../respiratory.json');

    // convert/setup our data for tensorflow.js
    // tensor of features for training data, include only features, not the output
    const trainingData = tf.tensor2d(data.map(item => [
        item['Genetic Risk'], item.Obesity, item.Smoking,
        item['Weight Loss'], item['Swallowing Difficulty'],
        item['Dry Cough']
    ]));

    // tensor of output for training data
    // the values for risk will be:
    // high:       1,0,0
    // medium:    0,1,0
    // low:   0,0,1
    const outputData = tf.tensor2d(data.map(item => [
        item.Risk === "High" ? 1 : 0,
        item.Risk === "Medium" ? 1 : 0,
        item.Risk === "Low" ? 1 : 0
    ]));

    // input data
    symptomsInput = {
        "Genetic Risk": parseInt(req.body.genetic),
        "Obesity": parseInt(req.body.obesity),
        "Smoking": parseInt(req.body.smoking),
        "Weight Loss": parseInt(req.body.weight),
        "Swallowing Difficulty": parseInt(req.body.swallowing),
        "Dry Cough": parseInt(req.body.cough)
    };

    //tensor of features for input data
    const inputData = tf.tensor2d([Object.values(symptomsInput)], [1, 6])

    // build neural network using a sequential model
    const model = tf.sequential();

    // add the first layer
    model.add(tf.layers.dense({
        inputShape: [6], // four input neurons
        activation: "sigmoid",
        units: 18 //dimension of output space (first hidden layer)
    }));

    //add the hidden layer
    model.add(tf.layers.dense({
        inputShape: [18], //dimension of hidden layer
        activation: "sigmoid",
        units: 3 //dimension of final output (high, medium, low)
    }));

    //add output layer
    model.add(tf.layers.dense({
        activation: "sigmoid",
        units: 3 //dimension of final output (high, medium, low)
    }));

    //compile the model with an MSE loss function and Adam algorithm
    model.compile({
        loss: "meanSquaredError",
        optimizer: tf.train.adam(0.06), // learning rate
    });

    // Train the model and predict the results for input data
    // train/fit the model for the specified number of epochs
    async function run() {
        const startTime = Date.now()
        //train the model
        await model.fit(trainingData, outputData,
            {
                epochs: 100,
                callbacks: { //list of callbacks to be called during training
                    onEpochEnd: async (epoch, log) => {
                        lossValue = log.loss;
                        console.log(`Epoch ${epoch}: lossValue = ${log.loss}`);
                        elapsedTime = Date.now() - startTime;
                        console.log('elapsed time: ' + elapsedTime);
                    }
                }
            }
        );

        const results = model.predict(inputData);

        // get the values from the tf.Tensor and send
        results.array().then(array => {
            console.log('\x1b[33m%s\x1b[0m', `Prediction Results: ${array}`);
            res.status(200).send(array[0]);
        });

    } //end of run function

    run();
};