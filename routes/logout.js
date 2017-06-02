/**
 * Created by alex on 01.06.17.
 */

let express = require('express');
let Users = require("../repositories/user");
let multiparty = require("multiparty");
let router = express.Router();

router.post("", function(req, res, next){
    "use strict";

    let sid = req.session.id;
    let io = req.app.get("io");

    io.sockets._events.sessreload(sid, function(){
        req.session.destroy(function(err){
            if (err) return next(err);
        });
    });

    res.send("");
});

module.exports = router;