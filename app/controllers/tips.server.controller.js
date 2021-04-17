const Tip = require('mongoose').model('Tip');

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

// Create a new motivational tip
exports.create = function (req, res) {
    // create tip instance
    var tip = new Tip();
    tip.author = req.userId;
    tip.title = req.body.title;
    tip.message = req.body.message;

    // save tip
    tip.save((err) => {
        if (err) {
            return res.status(400).json({ message: getErrorMessage(err) });
        } else {
            return res.status(200).end();
        }
    });
};

// Send all tips or by an author
exports.list = async function (req, res) {
    const query = req.params.authorId ? { author: authorId } : {};

    Tip.find(query)
        .populate('author')
        .sort({ date: -1 })
        .exec((err, tips) => {
            if (err) {
                return res.status(400).end();
            }
            return res.status(200).send({ tips: tips });
        })
};

// Delete an entry
exports.delete = function (req, res) {
    // check if user is authorized to delete
    if (req.tip.author === req.userId) {
        Tip.findByIdAndDelete(req.tip._id, (err) => {
            if (err) {
                return res.status(400).json({ message: getErrorMessage(err) });
            }
            return res.status(200).end();
        })
    } else {
        return res.status(400).json({ message: 'You are not authorized to delete this tip entry.' });
    }
};

// Get random entry
exports.getRandom = function (req, res) {
    Tip.count().exec((err, count) => {
        if (count === 0) {
            return res.status(304).end();
        }

        var random = Math.floor(Math.random() * count);

        Tip.findOne().skip(random).populate('author').exec((err, tip) => {
            return res.status(200).send({ tip: tip });
        })
    });
};

// Get a tip by ID
exports.tipByID = function (req, res, next, id) {
    Tip.findOne({ _id: id}, (err, tip) => {
        if (err) {
            return res.status(400).json({ message: getErrorMessage(err) });
        }
        req.tip = tip;
        next();
    })
}