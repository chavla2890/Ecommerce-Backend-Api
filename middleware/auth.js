const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = async(req, res, next) => {
  console.log("auth 1");
  try {
    const token = req.header('Authorization').replace('Bearer ', '').replaceAll('"', '')
    console.log("auth 2");
    console.log("type of token :- ",typeof(token))
    console.log("token -------> ",token);
    console.log("jwt -------->", process.env.JWT_SECRET); 
    const decoded = jwt.verify(token, process.env.JWT_SECRET)//
    console.log("decoded token --------> ", decoded);
    console.log("auth 3");
    const user = await User.findOne({ _id: decoded._id, 'tokens.token':token })
    console.log("auth 4");
    if(!user) {
      throw new Error
    }
    console.log("auth 5");
    req.token = token
    console.log("auth 6");
    req.user = user
    console.log("auth 7");
    next()
    console.log("auth 8");
} catch (error) {
  console.log(error);
res.status(401).send({error: "Authentication required"})
 }
}
module.exports = auth