var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    id: Number,
    name: String,
    email: String,
    gender: String,
    status: String,
    created_at: Date,
    updated_at: Date

},
    { timestamps: true }
);

const UserModel = mongoose.model('user', UserSchema, 'Users');
module.exports = UserModel