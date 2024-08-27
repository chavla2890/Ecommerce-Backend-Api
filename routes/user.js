const express = require('express');
const User = require('../models/User');
// import User from '../models/User.js';
const Auth = require('../middleware/auth')

const router = new express.Router()
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with a unique email and return an authentication token.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the user
 *               email:
 *                 type: string
 *                 description: Email address of the user
 *               password:
 *                 type: string
 *                 description: Password for the user account
 *             example:
 *               name: John Doe
 *               email: johndoe@example.com
 *               password: secret123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: Authentication token
 *       400:
 *         description: Bad request
 */
router.post('/users', async(req,res) =>{
    const user = new User(req.body)
    try{
        await user.save();
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (error){
        res.status(400).send(error)
    }
})


/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate a user with email and password, returning a JWT token.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the user
 *               password:
 *                 type: string
 *                 description: Password for the user account
 *             example:
 *               email: johndoe@example.com
 *               password: secret123
 *     responses:
 *       200:
 *         description: Login successful, returning user data and token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: Authentication token
 *       400:
 *         description: Invalid email or password
 */
router.post('/users/login', async(req, res)=>{
    try{
        // console.log("1");
        const user = await User.findByCredentials(req.body.email, req.body.password)
        // console.log("2");
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (error){
        res.status(400).send(error)
    }
})

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         tokens:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout the user
 *     description: Logs out the user from the current session, invalidating the JWT token.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.post('/users/logout', Auth, async (req, res) => {
    try {
      req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
      await req.user.save();
      res.send();
    } catch (error) {
      res.status(500).send();
    }
  });
  
  

// Example Bearer token:
// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmM4YWI3MjM1YjAwMTExM2I1MjA4YTYiLCJpYXQiOjE3MjQ0Nzk5MDh9.jeKltDULYZJviibeBWMFvsMMR2OtqVr9-6jobxRfg8s

/**
 * @swagger
 * /users/logoutAll:
 *   post:
 *     summary: Logout the user from all sessions
 *     description: Logs out the user from all sessions by clearing all JWT tokens.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout from all sessions successful
 *       500:
 *         description: Server error
 */
router.post('/users/logoutAll', Auth, async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(error){
        res.status(500).send()
    }
})


module.exports = router
