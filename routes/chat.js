/**
 * Created by alex on 31.05.17.
 */

let express = require('express');
let router = express.Router();
let chat = require("../chat");
let multiparty = require("multiparty");

/* GET home page. */
router.post('/history', function(req, res, next) {
    chat.history(req, res);
});
router.get('/subscribe', function(req, res, next) {
    chat.subscribe(req, res);
});
router.post('/publish', function(req, res, next) {
    let form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        if (err){
            res.statusCode = 400;
            console.log(err);
            res.end("Error");
        } else {
            chat.publish(fields);
            res.end("");
        }
    });
});

module.exports = router;
