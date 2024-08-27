const express = require('express')
const Item = require('../models/Item')
const Auth = require('../middleware/auth')

const router= new express.Router()

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Add a new item
 *     tags: [Item]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the item
 *               description:
 *                 type: string
 *                 description: Description of the item
 *               category:
 *                 type: string
 *                 description: Category of the item
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Price of the item
 *             required:
 *               - name
 *               - price
 *     responses:
 *       201:
 *         description: Item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '../models/Item'
 *       400:
 *         description: Error while adding item
 */
// add item
router.post('/items', Auth, async(req,res)=>{
    try{

        const newItem = new Item({
            ...req.body,
            owner: req.user._id
        })
        await newItem.save()
        res.status(201).send(newItem)
    }catch (error){
        res.status(400).send({message : "error---- while adding item"})
    }    
})


/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Get a single item by ID
 *     tags: [Item]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item
 *     responses:
 *       200:
 *         description: Item retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 *       400:
 *         description: Error retrieving item
 */
//  get single item
router.get('/items/:id', Auth, async(req, res)=>{
    try{
        const item = await Item.findOne({_id: req.params.id})
        if(!item){
            res.status(404).send({error:"Item Not found"})
        }
        res.status(200).send(item)
    }catch (error){ 
        res.status(400).send(error)
    }
})


/**
 * @swagger
 * /items:
 *   get:
 *     summary: Retrieve all items
 *     tags: [Item]
 *     responses:
 *       200:
 *         description: List of items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       400:
 *         description: Error retrieving items
 */
//get All item
router.get('/items', async(req, res)=>{
    try{
        const items = await Item.find({})
        res.status(200).send(items)
    }catch(error){
        res.status(400).send(error)
    }
})

/**
 * @swagger
 * /items/{id}:
 *   patch:
 *     summary: Update an existing item by ID
 *     tags: [Item]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the item
 *               description:
 *                 type: string
 *                 description: Description of the item
 *               category:
 *                 type: string
 *                 description: Category of the item
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Price of the item
 *             required:
 *               - name
 *               - price
 *     responses:
 *       200:
 *         description: Item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Error updating item
 *       404:
 *         description: Item not found
 */
// update item
router.patch('/items/:id', Auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'description', 'category', 'price']
    const isValidOperation = updates.every((update) =>              allowedUpdates.includes(update))
       if(!isValidOperation) {
         return res.status(400).send({ error: 'invalid updates'})
    }
    try {
      const item = await Item.findOne({ _id: req.params.id})
      if(!item){
          return res.status(404).send()
      }
      updates.forEach((update) => item[update] = req.body[update])
      await item.save()
      res.send(item)
    } catch (error) {
    res.status(400).send(error)
    }
    })

    /**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Delete an item by ID
 *     tags: [Item]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item to delete
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Error deleting item
 *       404:
 *         description: Item not found
 */
    router.delete('/items/:id', Auth, async(req,res) =>{
        try{
            const deletedItem = await Item.findOneAndDelete({_id: req.params.id})
            if(!deletedItem){
                res.status(400).send({error: "item not found"})
            }
            res.send(deletedItem)
        }catch (error){
            res.status(400).send(error)
        }
    })

module.exports = router