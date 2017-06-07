var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.user){
        res.redirect("/chat");
    } else {
        res.render('auth', {});
    }
});

module.exports = router;
