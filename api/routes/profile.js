const express = require("express");
const router = express.Router();

router.get("/", function(req, res, next) {
    res.send("PROFILE PAGE");
});

router.post("/", (req,res) => {
    
})

module.exports = router;
