import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name']
  },
  email: {
    type: String,
    required: [true, 'Please provide a valid email'],
    unique: true,
  },
  password: {
    type: String,
  },
  date: {
    type: String,
    required: [true, 'Please provide a date']
  },
  message:{
    type: String,
  },
  time: {
    type: String,
    required: [true, 'Please provide a time']
  },
  url: {
    type: String,
    required: [true, 'Please provide Photos']
  },
  hash: {
    type: String,
    required: [true, 'Please provide a hash']
  }, 
  paid: {
    type: Boolean,
    default: false
  },
  photos: {
    type: [String],
    required: true, // Set to true if this field must be present
  },
  musicLink: {
    type: String,
  },
  qrCode: {
    type: String,
  },
  firstAccess: { type: Boolean, default: true }

}, { timestamps: true });

const User = mongoose.models?.User || mongoose.model('User', UserSchema);

export default User;