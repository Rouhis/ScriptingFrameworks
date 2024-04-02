import mongoose from 'mongoose';
import {SchemaTypes} from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
      unique: true, // Ensure unique usernames
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure unique emails
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {timestamps: true}
); // Add timestamps for created and updated at

module.exports = mongoose.model('User', userSchema);
