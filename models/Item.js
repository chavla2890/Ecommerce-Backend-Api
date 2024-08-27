const mongoose = require('mongoose');
const ObjectId =  mongoose.Schema.Types.ObjectId

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - owner
 *         - name
 *         - description
 *         - category
 *         - price
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the item.
 *           example: 6123a4f7e5f6d9b8a6e3f1c1
 *         owner:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the user who owns the item.
 *           example: 6123a4f7e5f6d9b8a6e3f1c2
 *         name:
 *           type: string
 *           description: The name of the item.
 *           example: "Smartphone"
 *         description:
 *           type: string
 *           description: A detailed description of the item.
 *           example: "Latest model with 128GB storage"
 *         category:
 *           type: string
 *           description: The category to which the item belongs.
 *           example: "Electronics"
 *         price:
 *           type: number
 *           format: float
 *           description: The price of the item.
 *           example: 299.99
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the item was created.
 *           example: 2023-08-24T10:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the item was last updated.
 *           example: 2023-08-24T10:00:00.000Z
 */
const itemSchema = mongoose.Schema({
    owner : {
        type : ObjectId,
        ref:'User',
        required: true
    },
    name:{
        type: String,
        required: true,
        trim : true
    },
    description : {
        type: String,
        required : true
    },
    category:{
        type: String,
        required : true
    
    },
    price:{
        type: Number,
        required : true
    
    }

},{timeStamps: true})

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;