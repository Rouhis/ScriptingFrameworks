import mongoose from 'mongoose';
import {SchemaTypes} from 'mongoose';
import {User} from '../../types/DBTypes';

const userSchema = new mongoose.Schema(
  {
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

export default mongoose.model<User>('User', userSchema);
