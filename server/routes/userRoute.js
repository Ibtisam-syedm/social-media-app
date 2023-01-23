const router = require("express").Router();

router.get("/",(req,res)=>{
    res.send({"status":"success"})
})

module.exports = router;