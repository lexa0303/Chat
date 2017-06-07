/**
 * Created by alex on 25.05.17.
 */

function User(name){
    this.name = name;
}

User.prototype.hello = function(who){
    console.log("Hello " + who.name);
};

exports.User = User;