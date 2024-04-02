import mongoose from 'mongoose';
import {SchemaTypes} from 'mongoose';

const catSchema = new mongoose.Schema({
  cat_name: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  filename: {
    type: String,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  coords: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference the User model by its name
  },
});

module.exports = mongoose.model('Cat', catSchema);
