const router = require("express").Router();
const dotenv = require("dotenv");
const User = require("../models/User");
const crypto = require("crypto");
dotenv.config();
const sha256Hasher = crypto.createHash("sha256", process.env.SHA256_KEY);
function emptyCheckForObject(value) {
    return Object.keys(value).length === 0 && value.constructor === Object; // 👈 constructor check
}
//REGISTER
/**
 * Registers a new user in the database
 * 
 * @param {string} username new username for new record
 * @param {string} email its emails
 * @param {string} password user's password
 */
router.post("/register", async (req, res) => {
    let data = req.body
    if (emptyCheckForObject(data)){
        // console.log(data);
        res.status(412).json({"status":"req.body is empty","descripton":"Required three arugments username,email and, password"})
    }
    else{
        // object validation
        try {
            //create new user
            const newUser = new User({
              username: data.username,
              email: data.email,
            //   password: sha256Hasher.update(data.password).copy().digest("hex"),
              password: data.password
            });
        
            //save user and respond
            try {
              const user = await newUser.save();
              res.status(200).json(user);
            } catch (err) {
              res.status(500).json(err);
            }
          } catch (err) {
            res.status(500).json(err);
          }
    }
});

//Login

/**
 * Returns status for login into the system
 * 
 * @param {string} email user's email, will check in the database for existing record
 * @param {string} password user's password, will check the password if the email exist in the database 
 */

router.get("/login",async (req,res)=>{
    let data = req.body
    if (emptyCheckForObject(data)){
        // console.log(data);
        res.status(412).json({"status":"req.body is empty","descripton":"Required two arugments email and, password"})
    }
    else{
        //object validation
        try {
            const user = await User.findOne({email:req.body.email})
            if(user == null){
                res.status(404).json({"status":"failed","description":"User does not exist"})
            }
            else{
                // if(user.password === sha256Hasher.update(data.password).digest("hex")){
                if(user.password === data.password){
                    res.status(200).json({"status":"success","decription":"let the user login into app","user":user})
                }
                else{
                    res.status(400).json({"status":"failed","description":"Wrong password"})
                }
                // console.log(user);
                
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }

});
module.exports = router;
