import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
    unique: true
  },
  password: {
    type: String,
    minlength: 6,
    required: true
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
    unique: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
  }
}, { timestamps: true, collection: 'users' })

export const UserModel = mongoose.model('User', schema)