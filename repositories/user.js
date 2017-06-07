/**
 * Created by alex on 30.05.17.
 */

let Repository = require('./main');
let User = require('../schemas/user');

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

module.exports = new UserRepository();