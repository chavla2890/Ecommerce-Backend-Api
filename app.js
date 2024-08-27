const express = require('express');
const userRouter = require('./routes/user')
const itemRouter = require('./routes/item')
const cartRouter = require('./routes/cart')

require('./db/mongoose')

const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')


const app = express();
const port = process.env.PORT || 3000

const swaggerDefinition = {
    openapi: '3.0.0',
    info:{
        title: 'Ecommerce Backend Restful Api',
        version: '1.0.0',
        description: 'Ecommerce backend api using nodejs express js and mongodb',

    },
   servers: [
    {
        url: 'http://localhost:3000/'
    },
   ],
};

const options  = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
};

const swaggerspec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerspec));



app.use(express.json())
app.use(userRouter)
app.use(itemRouter)
app.use(cartRouter)
 
app.listen(port,()=>{
    console.log("server is connected on port :- ", port)
})