// Load the module dependencies
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Define a schema
const Schema = mongoose.Schema;

// Define a new 'UserSchema'
var UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: 'Username is required',
        trim: true
    },
    password: {
        type: String,
        validate: [
            (password) => password && password.length > 6,
            'Password should be longer than 6 characters'
        ]
    },
    firstName: String,
    lastName: String,
    birthday: {
        type: Date,
        validate: [
            (birthday) => birthday < Date.now(),
            'Invalid birthday'
        ],
        required: true
    },
    gender: String,
    address: String,
    city: String,
    province: String,
    phoneNumber: String,
    email: {
        type: String,
        match: [/.+\@.+\..+/, "Please enter a valid email address"]
    },
    role: {
        type: String,
        validate: [
            (role) => role && (role == 'nurse' || role == 'patient'),
            'Role can only be either nurse or patient'
        ]
    }
});

// Set the 'fullname' virtual property
UserSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName;
});

// Set the 'fullAddress' virtual property
UserSchema.virtual('fullAddress').get(function () {
    return `${this.address}, ${this.city}, ${this.province}`;
});

// Set the 'age' virtual property
UserSchema.virtual('age').get(function () {
    return calculate_age(this.birthday);
});

// Set the 'birthdate' virtual property
UserSchema.virtual('birthdate').get(function () {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return `${months[this.birthday.getMonth()]} ${this.birthday.getDate() + 1}, ${this.birthday.getFullYear()}`;
});

function calculate_age(dob) {
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms);

    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

// Use a pre-save middleware to hash the password
// before saving it into database
UserSchema.pre('save', function (next) {
    //hash the password before saving it
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
});

// Configure the 'UserSchema' to use getters and virtuals when transforming to JSON
UserSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

// Create the 'User' model out of the 'UserSchema'
mongoose.model('User', UserSchema);