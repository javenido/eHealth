const User = require('mongoose').model('User');
const Alert = require('mongoose').model('Alert');

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

// Create a new emergency alert
exports.create = function (req, res) {
    // create alert instance
    var alert = new Alert();
    alert.patient = req.userId;
    alert.alertDescription = req.body.alert;

    // save alert
    alert.save((err) => {
        if (err) {
            return res.status(400).json({ message: getErrorMessage(err) });
        } else {
            return res.status(200).end();
        }
    });
};

// Send all emergency alerts
exports.list = function (req, res) {
    Alert.find()
        .populate('patient')
        .sort({ date: -1 })
        .exec((err, alerts) => {
            if (err) {
                return res.status(400).json({ message: getErrorMessage(err) });
            }
            return res.status(200).send({ alerts: alerts });
        })
};

// Get an alert by ID
exports.alertByID = function (req, res, next, id) {
    Alert.findOne({ _id: id }, (err, alert) => {
        if (err) {
            return res.status(400).json({ message: getErrorMessage(err) });
        }
        req.alert = alert;
        next();
    })
};

// Delete an alert
exports.delete = function (req, res) {
    Alert.findByIdAndDelete(req.alert._id, (err) => {
        if (err) {
            return res.status(400).json({ message: getErrorMessage(err) });
        }
        return res.status(200).end();
    });
};