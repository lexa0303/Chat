/**
 * Created by alex on 01.06.17.
 */

let Users = require("../repositories/user");

module.exports = function(req, res, next){
    "use strict";
    req.user = res.locals.user = null;
    if (!req.session.user) return next();

    Users.getById(req.session.user, function(err, user){
        if (err) return next(err);

        req.user = res.locals.user = user;
        // req.user.personal_photo = new Buffer(req.user.photo.data).toString('base64');
        next();
    });
};