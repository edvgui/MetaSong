const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');

const UserSchema = new Schema({
    admin: {
        type: Boolean,
        default: false
    },
    first_name: {
        type: String,
        required: [true, 'first_name is required']
    },
    last_name: {
        type: String,
        required: [true, 'last_name is required']
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        validate: {
            validator(email) {
                return validator.isEmail(email);
            },
            message: '{VALUE} is not a valid email.'
        }
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: [8, 'Password need to be at least 8 characters'],
        validate: {
            validator(password) {
                const passwordReg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
                return passwordReg.test(password);
            },
            message: 'The password should contain lower and upper cases as well as special characters',
        },
    }
});

UserSchema.plugin(uniqueValidator, {
    message: '{VALUE} already taken!',
});

UserSchema.pre('findOneAndUpdate', function (next) {
    if (this._update.password) {
        this._update.password = hashSync(this._update.password);
    }
    return next();
});

UserSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        this.password = this._hashPassword(this.password);
    }
    return next();
});

UserSchema.methods = {
    _hashPassword(password) {
        return crypto.createHash('sha256').update(password, 'utf-8').digest('hex');
    },

    toJSON() {
        return {
            _id: this._id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email
        }
    },

    toYou() {
        return {
            _id: this._id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email
        }
    },
}

module.exports = mongoose.model('User', UserSchema);