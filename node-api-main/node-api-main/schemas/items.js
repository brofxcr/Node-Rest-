import mongoose from "mongoose";

import {Roles} from '../constants.js';

const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: false
  },
  avaliable: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default itemsSchema;