const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const {
  ValidateUserSignup,
  ValidateUserSignin
} = require("../handlers/validation");

//eslint-disable-next-line
exports.signup = async (req, res) => {
  //Validating user inputs / data
  const { error } = ValidateUserSignup(req.body);
  if (error)
    return res.status(400).json({
      error: error.details[0].message
    });

  //check if the user exist
  const isUserExist = await User.findOne({ email: req.body.email });
  if (isUserExist)
    return res.status(400).json({
      error: new Error(`User with ${req.body.email} already exist!`)
    });

  //Encrpting user password before saving to the database
<<<<<<< HEAD
  const solt = bcrypt.genSalt(10);
  const hashed_password = await bcrypt.hash(req.body.password, solt);
=======

  const hashed_password = await bcrypt.hash(req.body.password, 12);
>>>>>>> c002f9bc89bd44134eeee4f54e8550f62f52b704
  if (!hashed_password)
    return res.status(500).json({ message: "Something went wrong! :)" });

  //Creating new user after it passes all the above validation base on the user data
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashed_password
  });

  //saving the data to the database
  await user.save();
  if (user)
    res
      .status(201)
      .json({ userId: user.id, message: "User created Successfully!" });
};

//eslint-disable-next-line
exports.signin = async (req, res) => {
  //1: Validating user inputs / data
  const { error } = ValidateUserSignin(req.body);
  if (error)
    return res.status(400).json({
      error: error
    });

  //2. find the user in the database with the given email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json({
      errror: new Error(`User with ${req.body.email} doesn't exist!`)
    });

  //2. if the user exist, compare the current entered password with the one
  // the database
  //3. Check if the password is valid, if it is send a token back
  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid)
    return res.status(400).json({
      error: new Error("Incorrect password combo")
    });

    //returning a token for login in user
  const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
  res.status(200).json({
    token: token
  });
};

//eslint-disable-next-line
exports.signout = (req, res) => {
  res.send("Your'r log out");
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users)
    return res.status(404).json({
      error: new Error("users not found!")
    });

  res.status(200).json(users);
};
