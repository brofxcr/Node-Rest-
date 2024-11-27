import express from 'express';
import jwt from 'jsonwebtoken';

import Items from '../models/items.js';
import {JWT_SECRET} from '../constants.js';

const router = express.Router();

const authMiddleware = (req, res, next) =>{
  const token = req.headers.authorization;

  if (!token) return res.status(401).send('Error');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).send('error');
  }
};

router.get('/',authMiddleware, async(req, res) =>{
  const {name, price, isAvailable} = req.body;
  try {
    const allItems = await Items.find();
    res.send(allItems);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

router.post('/signup', async (req, res) => {
  if(!req.body) {
    return res.status(400).send("error");
  }
  const {name, price} = req?.body;

  if (!name || !price) {
    return res.status(400).send('Fill required fields');
  }

  if (name.length < 3 ) {
    return res.status(400).send('Password is too short');
  }

  try {
    const existingItems = await Items.findOne({name});
    if(existingItems) {
      return res.status(409).send('Item with this name already exists');
    }

    const newItem = await Items.create({name, price});
    res.status(201).send(newItem);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/login', async (req, res) => {
  const {name, price} = req?.body;

  if (!name || !price) {
    return res.status(400).send('No credentials provided');
  }

  try {
    const existingItems = await Items.findOne({name, price});
    if(!existingItems) {
      return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({id: existingItem._id, name: existingItem.name, role: existingItem.role}, JWT_SECRET, {expiresIn: '15m'});
    res.status(200).send(token);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/me', async (req, res) => {
  const token = req.headers.authorization;

  if(!token) {
    return res.status(400).send("No token provided");
  }

  try {
    const verificationResult = jwt.verify(token, JWT_SECRET);
    const {id} = verificationResult;

    const items = await Items.findById(id);

    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(items);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.patch('/:id', async (req, res) => {
  const itemsToUpdateId = req.params.id;
  const {name, price, role} = req.body;
  const token = req.headers.authorization;
  try {
      const verificationResult = jwt.verify(token, JWT_SECRET);

      if(!verificationResult) {
        return res.status(401).send("Invalid token");
      }

      const {id} = verificationResult;
      const items = await Items.findById(id);

      if(!items) {
        return res.status(404).send('User not found');
      }

      if(itemsToUpdateId !== items.id && items.role !== Roles.ADMIN) {
        return res.status(403).send('Not allowed to update');
      }

      const itemsToUpdate = await Items.findById(userToUpdateId);
      if (!itemsToUpdate) {
        return res.status(400).send("User to update not found");
      }

      const updatedItems = await Items.updateOne(itemsToUpdateId, {name, price, role}, {new: true});
      return res.status(200).send(updatedItems);
  } catch (err) {
   return res.status(500).send(err);
  }
 });

 router.get('/all', async (req, res) => {
  const token = req.headers.authorization;

  try {
    const verificationResult = jwt.verify(token, JWT_SECRET);

    if(!verificationResult) {
      return res.status(401).send("Invalid token");
    }

    const {id} = verificationResult;

    const items = await Items.findById(id);

    if(!items) {
      return res.status(404).send('Item not found');
    }

    const items = await Items.find();
    return res.status(200).send(items);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.delete('/:id', async (req, res) => {
  const token = req.headers.authorization;
  const itemsToDeleteId = req.params.id;

  try {
    const verificationResult = jwt.verify(token, JWT_SECRET);

    if(!verificationResult) {
      return res.status(401).send("Invalid token");
    }

    const {id} = verificationResult;

    const items = await Items.findById(id);

    if(!items) {
      return res.status(404).send('Item not found');
    }

    if(itemsToDeleteId !== items.id) {
      return res.status(403).send("Operation not allowed");
    }

    const deletedItem = await Items.findOneAndDelete({_id: itemsToDeleteId});
    return res.status(200).send(deletedItems);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get('/singleEndpointMiddleware', (req, res) => {
  return res.status(200).send("Response");
});

export default router;