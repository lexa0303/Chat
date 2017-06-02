/**
 * Created by alex on 02.06.17.
 */

let Users = require("../repositories/user");

module.exports = function(req, res, next){
    "use strict";
    console.log(req.session);
    if (!req.session.user) {
        if (req.url !== "/"){
            res.send(403, "Forbidden");
        } else {
            next();
        }
    } else {
        next();
    }

};