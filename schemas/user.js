/**
 * Created by alex on 30.05.17.
 */

let crypto = require("crypto");
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    globalId: Schema.Types.ObjectId,
    login: {
        type: String,
        unique: true,
        required: true
    },
    // userName: {
    //     type: String,
    //     // unique: true,
    //     // required: true
    // },
    passwordHash: {
        type: String,
        required: true
    },
    salt:{
        type: String,
        required: true
    },
    photo:{
        data: {
            type: Buffer,
            contentType: String
        }
    },
    photo_name: {
        type: String
    },
    photo_type: {
        type: String
    },
    created:{
        type: Date,
        default: Date.now
    }
});

userSchema.methods.encryptPassword = function(password){
    "use strict";
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

userSchema.virtual("password").set(function(password){
    "use strict";
    this._plainPassword = password;
    this.salt = Math.random() + "";
    this.passwordHash = this.encryptPassword(password);
}).get(function(){
    "use strict";
    return this._plainPassword;
});

userSchema.methods.checkPassword = function(password){
    "use strict";
    return this.encryptPassword(password) === this.passwordHash;
};

module.exports = mongoose.model("User", userSchema);