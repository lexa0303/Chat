/**
 * Created by alex on 30.05.17.
 */

let Repository = require('./main');
let User = require('../schemas/user');
let fs = require('fs');

function UserRepository() {
    Repository.prototype.constructor.call(this);
    this.model = User;
}

UserRepository.prototype = new Repository();

UserRepository.prototype.authorize = function(login, password, next){
    "use strict";
    let Users = this;

    Users.get({login: login}, "", "", "", function(err, arUsers){
        if (err) return next(err);

        let user = arUsers.pop();

        if (user){
            if (user.checkPassword(password)){
                next(null, user);
            } else {
                next(new Error("Wrong password"));
            }
        } else {
            let newUser = new Users.model({login: login, password: password});
            Users.add(newUser, function (err) {
                if (err) return next(err);
                next(null, newUser);
            });
        }
    });
};

UserRepository.prototype.edit = function(userId, fields, files, callback){
    "use strict";

    let Users = this;

    Users.getById(userId, function(err, user){
        if (err) return callback(err);

        let oldUser = user;

        for (let i in fields){
            if (fields.hasOwnProperty(i)){
                if (user[i] !== undefined){
                    if (typeof fields[i] === 'object'){
                        user[i] = fields[i].pop();
                    } else {
                        user[i] = fields[i];
                    }
                }
            }
        }

        for (let i in files){
            if (files.hasOwnProperty(i)){
                if (user[i] !== undefined){
                    let file;
                    if (typeof files[i] === 'object'){
                        file = files[i].pop();
                    } else {
                        file = files[i];
                    }

                    if (file.originalFilename) {
                        user.photo.data = fs.readFileSync(file.path);
                        user.photo_name = file.originalFilename;
                        user.photo_type = file.headers['content-type'];
                    }
                }
            }
        }

        Users.update(userId, user);
    });

    callback(null);
};

module.exports = new UserRepository();