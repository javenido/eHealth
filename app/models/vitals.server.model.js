const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This is the model for vital signs readings.
const VitalsSchema = new Schema({
    addedBy: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    patient: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    temp: Number, // body temperature in °C
    hRate: {
        type: Number, // heart or pulse rate (bpm)
        validate: [(hRate) => hRate >= 0, 'Invalid heart rate']
    },
    sbp: {
        type: Number, // systolic
        validate: [(sbp) => sbp >= 0, 'Invalid blood pressure']
    },
    dbp: {
        type: Number, // diastolic
        validate: [(dbp) => dbp >= 0, 'Invalid blood pressure']
    },
    rRate: {
        type: Number, // respiratory rate (breaths in one minute)
        validate: [(rRate) => rRate >= 0, 'Invalid respiratory rate']
    },
    weight: {
        type: Number, // body weight in kg
        validate: [(weight) => weight >= 0, 'Invalid body weight']
    },
    date: {
        type: Date, // date created or last edited
        default: Date.now
    }
});

// Set the 'bp' virtual property
VitalsSchema.virtual('bp').get(function () {
    return `${this.sbp}/${this.dbp}`;
});

// Set the 'dateRecorded' virtual property
VitalsSchema.virtual('dateRecorded').get(function () {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return `${months[this.date.getMonth()]} ${this.date.getDate() + 1}, ${this.date.getFullYear()} ` +
        `${this.date.getHours() == 0 ? '12' : (this.date.getHours() % 12 > 0 && this.date.getHours() % 12 <= 9 ? '0' : '') + this.date.getHours() % 12}` +
        `:${this.date.getMinutes() <= 9 ? '0' : ''}${this.date.getMinutes()} ${this.date.getHours() < 12 ? 'AM' : 'PM'}`;
});

// Configure the 'VitalsSchema' to use getters and virtuals when transforming to JSON
VitalsSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

// Create the 'Vitals' model out of the 'VitalsSchema'
mongoose.model('Vitals', VitalsSchema);