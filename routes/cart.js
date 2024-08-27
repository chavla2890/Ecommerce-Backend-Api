const express = require('express');
const Cart = require("../models/Cart");
const Item = require("../models/Item");
const Auth = require("../middleware/auth");

const router = new express.Router();

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Retrieve the cart for the authenticated user
 *     tags: [Cart]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Server error
 */
router.get("/cart", Auth, async(req, res) =>{
    const owner = req.user._id;
    try{
        const cart = await Cart.findOne({owner});
           if(cart && cart.item.length > 0){
                res.status(200).send(cart);
           }else{
            res.send(null)
           }
    } catch (error){
        res.status(500).send(error)
    }
})

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *                 description: ID of the item to add
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the item to add
 *             required:
 *               - itemId
 *               - quantity
 *     responses:
 *       200:
 *         description: Item added to the cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       201:
 *         description: New cart created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Item not found
 *       500:
 *         description: Server error
 */
router.post("/cart", Auth, async(req,res)=>{
    const owner = req.user._id;
    const {itemId, quantity} = req.body;
     try{
        const cart = await Cart.findOne({owner});
        const item = await Item.findOne({_id: itemId})
        if(!item){
            res.status(404).send({message : "item not found"});
            return;
        }

        const price = item.price;
        const name = item.name;

        // if cart already exist for the user
        if(cart){
            const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);
            // check if product exist or not
            if(itemIndex > -1){
                let product = cart.items[itemIndex];
                product.quantity += quantity;
                cart.bill = cart.items.reduce((acc, curr) =>{
                    return acc + curr.quantity * curr.price;
                },0)
                cart.items[itemIndex] = product;
                await cart.save()
                res.status(200).send(cart);
            }else{
                cart.items.push({ itemId, name, quantity, price });
                cart.bill = cart.items.reduce((acc, curr) => {
                return acc + curr.quantity * curr.price;
            },0)
            await cart.save();
            res.status(200).send(cart);
         }
     } else {
        //  no cart exixt, create one 
        const newCart = await Cart.create({
            owner,
            items: [{itemId, name, quantity, price}],
            bill: quantity * price,
        });
        return res.status(201).send(newCart);
     }
} catch(error){
    console.log(error);
    res.status(500).send("something went wrong")
}
})


/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: query
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           description: ID of the item to remove
 *     responses:
 *       200:
 *         description: Item removed from the cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Item not found
 *       500:
 *         description: Server error
 */
router.delete("/cart/", Auth, async (req, res) => {
    const owner = req.user._id;
    const itemId = req.query.itemId;
    console.log(itemId);
    try {
       let cart = await Cart.findOne({ owner });
       const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);
    if (itemIndex > -1) {
         let item = cart.items[itemIndex];
         cart.bill -= item.quantity * item.price;
    if(cart.bill < 0) {
          cart.bill = 0
    }
         cart.items.splice(itemIndex, 1);
         cart.bill = cart.items.reduce((acc, curr) => {
    return acc + curr.quantity * curr.price;
    },0)
        cart = await cart.save();
        res.status(200).send(cart);
    } else {
        res.status(404).send("item not found");
    }
    } catch (error) {
       console.log(error);
       res.status(400).send();
    }
    });

module.exports = router;