import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  
  phone: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['renter', 'owner', 'admin'],
    default: 'renter'
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
