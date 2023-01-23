const router = require("express").Router();
const User = require("../models/User.js")

//Update user
/**
 * Updates a user in the database
 * 
 * @param {string} id username id (in params)
 * @param {string} updatedDatainJson json object that must match with schema names (in body)
 */
router.put("/:id", async (req, res) => {
    console.log("in the router");
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        console.log("User id given");
    //   if (req.body.password) {
        // try {
        //   const salt = await bcrypt.genSalt(10);
        //   req.body.password = await bcrypt.hash(req.body.password, salt);
        // } catch (err) {
        //   return res.status(500).json(err);
        // }
    //   }
      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        console.log("Account updated");
        res.status(200).json("Account has been updated");
      } catch (err) {
        console.log("Error in the account");
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You can update only your account!");
    }
  });

//Delete user
/**
 * Delete a user in the database
 * 
 * @param {string} id username id (in params)
 * @param {string} id_toDelete id through which we will delete the account (in body)
 */
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account has been deleted");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You can delete only your account!");
    }
  });

/**
 * Get single user details
 */
router.get("/:id",async (req,res)=>{
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try{
            const user = await User.findById(req.body.userId);
            const {password,updatedAt, ...other} = user._doc;
            res.status(200).json(other);
        }
        catch(error){
            res.status(500).json(error)
        }
    }else {
      return res.status(403).json("You can view only your account!");
    }
});

//follow a user
//need following account id in body
//need current account it in params
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (!user.followers.includes(req.body.userId)) {
          await user.updateOne({ $push: { followers: req.body.userId } });
          await currentUser.updateOne({ $push: { followings: req.params.id } });
          res.status(200).json("user has been followed");
        } else {
          res.status(403).json("you allready follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant follow yourself");
    }
  });
// router.get("/",(req,res)=>{
//     res.send({"status":"success"})
// })



//unfollow a user
//need following account id in body
//need current account it in params
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("user has been unfollowed");
        } else {
          res.status(403).json("you dont follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant unfollow yourself");
    }
  });
module.exports = router;