const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please add a first name']
    },
    lastName: {
        type: String,
        required: [true, 'Please add a last name']
    },
    username: {
        type: String,
        required: [true, 'Please add a username'],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minLength: 6,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {
    timestamps: true,
    versionKey: false,
});
// userSchema.methods.toJSON = function() {
// 	const userObj = this.toObject();
// 	delete userObj.password;

// 	return userObj;
// }

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 8);
    // next();
});

// sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// match user entered password to hashed password
userSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

// // generate and hash password
// userSchema.methods.getResetPasswordToken = function() {
//     // generate token
//     const resetToken = crypto.randomBytes(20).toString('hex');
//     // hash token and set to resetPasswordToken field
//     this.resetPasswordToken = crypto
//         .createHash('sha256')
//         .update(resetToken)
//         .digest('hex');

//     // set expire
//     this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

//     return resetToken;
// }

module.exports = mongoose.model('User', userSchema);