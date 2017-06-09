/**
 * Created by alex on 31.05.17.
 */

let express = require('express');
let Users = require("../repositories/user");
let multiparty = require("multiparty");
let router = express.Router();

router.get("", function(req, res){
    "use strict";
    res.render("auth");
});

router.post("", function(req, res, next){
    "use strict";

    let form = new multiparty.Form();


    form.parse(req, function(err, fields, files) {
        if (err){
            res.statusCode = 400;
            console.log(err);
            res.end("Error");
        } else {
            let login = fields.login.pop();
            let password = fields.password.pop();

            Users.authorize(login, password, function(err, user){
                if (err) return next(err);

                req.session.user = user._id;
                res.redirect("/personal");
            })
        }
    });
});

module.exports = router;