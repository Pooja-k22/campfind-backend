const users = require("../model/userModel");
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");

// import camp model
const campSpots = require("../model/campSpotModel");

// register
exports.registerController = async (req, res) => {
  // logic

  const { username, email, password } = req.body;
  console.log(username, email, password);

  try {
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      res.status(409).json("Already user exist");
    } else {
      // password hashing
      // const salt = await bcrypt.genSalt();
      // const hashedPassword = await bcrypt.hash(password, salt);

      const newuser = new users({
        username,
        email,
        password,
      });

      await newuser.save();
      res.status(200).json(newuser);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// login
exports.loginController = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      // Compare hashed password
      // const isMatch = await bcrypt.compare(password, existingUser.password);
      if (existingUser.password == password) {
        // token generate
        const token = jwt.sign(
          { userId: existingUser._id, userMail: existingUser.email },
          "secretkey"
        );
        res.status(200).json({ existingUser, token });
      } else {
        res.status(401).json("invalid email or password");
      }
    } else {
      res.status(404).json("Account does not exist");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// google login
exports.googleLoginController = async (req, res) => {
  const { username, email, password, photo } = req.body;
  console.log(username, email, password, photo);

  try {
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      const token = jwt.sign(
        { userId: existingUser._id, userMail: existingUser.email },
        "secretkey"
      );
      res.status(200).json({ existingUser, token });
    } else {
      const newuser = new users({
        username,
        email,
        password,
        profile: photo,
      });

      await newuser.save();
      const token = jwt.sign(
        { userId: newuser._id, userMail: newuser.email },
        "secretkey"
      );
      res.status(200).json({ existingUser: newuser, token });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// wishlist add
exports.WishlistControlller = async (req, res) => {
  const userId = req.payload.userId;
  const { campId } = req.body;

  try {
    const user = await users.findOne({ _id: userId });

    const alreadyWishlisted = user.wishlist.includes(campId);

    if (alreadyWishlisted) {
      // remove it
      user.wishlist = user.wishlist.filter((id) => id !== campId);
      await user.save();
      res.status(200).json({ wishlist: user.wishlist });
    } else {
      user.wishlist.push(campId);
      await user.save();
      res.status(200).json({ wishlist: user.wishlist });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// get wishlist
exports.getWishlistController = async (req, res) => {
  const userId = req.payload.userId;
  console.log(userId);

  try {
    // get user details
    const user = await users.findOne({ _id: userId });

    // get all camp details
    const camps = await campSpots.find({ _id: { $in: user.wishlist } });

    res.status(200).json({ wishlist: camps });
  } catch (error) {
    res.status(500).json(error);
  }
};

// update user profile
exports.userProfileEditController= async(req, res)=>{
  const {username, password,profile} = req.body

  console.log(username, password,profile);
  const prof = req.file? req.file.filename:profile

  const userMail = req.payload.userMail


  try {

     const userDetails = await users.findOneAndUpdate({email:userMail},{username,email:userMail ,password,profile:prof},{new:true})
    await userDetails.save()
    res.status(200).json(userDetails)

    
  } catch (error) {
    res.status(500).json(error)
  }
  
}


// get all user for admin page
exports.getAllUserController= async(req,res)=>{

  try {
    const AllUsers = await users.find({email:{$ne:"campfindadmin@gmail.com"}})
    res.status(200).json(AllUsers)
  } catch (error) {
    res.status(500).json(error)
  }
}

// admin   profilr edit
exports.adminProfileEditController = async(req,res)=>{

  const {username,password,profile} = req.body
  console.log(username, password,profile);
  const prof = req.file ? req.file.filename : profile

  const email = req.payload.userMail

  try {
    const adminDetails = await users.findOneAndUpdate({email},{username,password,profile:prof},{new:true})
    await adminDetails.save()
    res.status(200).json(adminDetails)
    
  } catch (error) {
    res.status(500).json(error)
    
  }
}

