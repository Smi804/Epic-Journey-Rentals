import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['renter', 'owner', 'admin'], default: 'renter' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
