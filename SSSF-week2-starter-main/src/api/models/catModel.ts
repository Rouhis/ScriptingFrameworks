import mongoose from 'mongoose';
import {SchemaTypes} from 'mongoose';
import {Cat} from '../../types/DBTypes';

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
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference the User model by its name
    required: [true, 'Owner is required.'],
  },
});

catSchema.index({location: '2dsphere'});

export default mongoose.model<Cat>('Cat', catSchema);
