


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');





const UserSchema =  mongoose.Schema({
    firstname: {type: String , required: true},
    lastname: {type: String , required: true},
    email: {type: String, required: true, unique: true},
    phonenumber: {type: String , required: true, },
    password: {type: String , required: true, },
    profileimage: {type: String},
    createdAt: { type: Date , default: Date.now},
});

UserSchema.pre('save' , function(next) {
    let user = this;
    if(!user.isModified("password")) {
        return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
        if(err){
            return next(err);
        }
        bcrypt.hash(user.password, salt,function(err, hashedpassword) {
            if(err) {
                return next(err);
            }
            user.password = hashedpassword;
            next();
        });
    });
});

UserSchema.methods.checkPassword = function(guess, done) {
    bcrypt.compare(guess, this.password, function(err, isMatch) {
        done(err, isMatch);
    });

};

UserSchema.methods.displayName = function() {
    return this.displayname || `${this.firstname} ${this.lastname}`;
} 

const User = mongoose.model('users',UserSchema );
module.exports = User;