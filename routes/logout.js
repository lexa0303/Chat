/**
 * Created by alex on 01.06.17.
 */

let express = require('express');
let Users = require("../repositories/user");
let multiparty = require("multiparty");
let router = express.Router();

router.post("", function(req, res, next){
    "use strict";

    req.session.destroy();
    res.redirect("/");
});

module.exports = router;