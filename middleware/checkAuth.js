/**
 * Created by alex on 02.06.17.
 */

let Users = require("../repositories/user");

module.exports = function(req, res, next){
    "use strict";
    if (!req.session.user) {
        if (req.url !== "/" && req.method === "GET"){
            res.redirect("/");
        } else {
            next();
        }
    } else {
        next();
    }

};