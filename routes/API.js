var express = require("express");
var router = express.Router();

router.get("/lol", function (req,res,next) {
    res.send(getAccID())
});

module.exports = router;