const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This is the model for emergency alerts.
const AlertSchema = new Schema({
    patient: {
        required: true,
        type: Schema.ObjectId,
        ref: 'User'
    },
    alertDescription: String, // describes the emergency
    date: {
        type: Date, // date created or last edited
        default: Date.now
    }
});

// Set the 'age' virtual property
AlertSchema.virtual('age').get(function () {
    let diffInMilliSeconds = (new Date() - this.date) / 1000;

    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;
    if (days > 0)
        return `${days} day${days > 1 ? 's' : ''}`;

    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;
    if (hours > 0)
        return `${hours} hour${hours > 1 ? 's' : ''}`;

    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;
    if (minutes > 0)
        return `${minutes} minute${minutes > 1 ? 's' : ''}`;

    return 'a few moments ';
});

// Configure the 'AlertSchema' to use getters and virtuals when transforming to JSON
AlertSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

// Create the 'Alert' model out of the 'AlertSchema'
mongoose.model('Alert', AlertSchema);