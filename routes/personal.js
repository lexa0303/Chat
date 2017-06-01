/**
 * Created by alex on 31.05.17.
 */

let express = require('express');
let Users = require("../repositories/user");
let multiparty = require("multiparty");
let router = express.Router();

router.get("", function(req, res){
    "use strict";
    res.render("personal");
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

        }
    });
});

module.exports = router;