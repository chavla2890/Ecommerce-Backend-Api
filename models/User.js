const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for a user.
 *           example: 6123a4f7e5f6d9b8a6e3f1c1
 *         name:
 *           type: string
 *           description: The user's name.
 *           example: john doe
 *         email:
 *           type: string
 *           description: The user's email address.
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           description: The user's password.
 *           minLength: 7
 *           example: secret123
 *         tokens:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT token for authentication.
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the user was created.
 *           example: 2023-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the user was last updated.
 *           example: 2023-01-01T00:00:00.000Z
 */

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password".');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, { timestamps: true });

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Unable to log in');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to log in');
    }
    return user;
};

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;









// const mongoose = require('mongoose')
// const validator = require('validator')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')


// const userSchema = mongoose.Schema({
//     name:{
//         type : String,
//         required: true,
//         trim: true,
//         lowercase: true
//     },
//     email:{
//         type: String,
//         required: true,
//         unique: true,
//         lowercase: true,
//             validate(value){
//                 if(!validator.isEmail(value)){
//                     throw new Error ("email is invalid")
//                 }
//             }
//     },
//     password:{
//         type: String,
//         required: true,
//         minLength: 7,
//         trim: true,
//         validate(value){
//             if(value.toLowerCase().includes('password')){
//                 throw new Error('password must contain password')
//             }
//         }
//     },
    
//     tokens:[{
//         token : {
//             type: String,
//             required: true
//         }
//     }]
// }, {timestamps:true})



// userSchema.methods.generateAuthToken  = async function () {
//     const user = this
//     // console.log("1")
//     const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET)
//     // console.log("auth token", token)
//     // console.log("Type:", typeof(token))
//     user.tokens = user.tokens.concat({ token });
//     // console.log("auth 2", user.tokens)
//     await user.save()
//     return token
//     }



  
//  userSchema.statics.findByCredentials = async (email, password) => {
//     const user = await User.findOne({ email })
//     if (!user) {
//         throw new Error('Unable to log in')
//     }
//     const isMatch = await bcrypt.compare(password, user.password)
//     if(!isMatch) {
//         throw new Error('Unable to login')
//     }
//     return user
// }
    
//     userSchema.pre('save', async function(next) {
//        const user = this
//           if (user.isModified('password')) {
//           user.password = await bcrypt.hash(user.password, 8)
//        }
//          next()
//        })

//     const User = mongoose.model("User", userSchema);
//     module.exports = User; 