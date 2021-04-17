const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This is the model for motivational tips.
const TipSchema = new Schema({
    author: {
        required: true,
        type: Schema.ObjectId,
        ref: 'User'
    },
    title: String,
    message: String, // the motivational tip
    date: {
        type: Date, // date created or last edited
        default: Date.now
    }
});

// Set the 'datePosted' virtual property
TipSchema.virtual('datePosted').get(function () {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return `${months[this.date.getMonth()]} ${this.date.getDate() + 1}, ${this.date.getFullYear()}`;
});

// Configure the 'TipSchema' to use getters and virtuals when transforming to JSON
TipSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

// Create the 'Tip' model out of the 'TipSchema'
mongoose.model('Tip', TipSchema);