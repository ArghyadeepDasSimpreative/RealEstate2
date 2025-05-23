import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    // required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'owner', 'client'],
    default: 'client',
  },
  status: {
    type: String,
    enum: ['verified', 'pending', 'blocked'],
    default: 'verified',
  },
  profileImage: {
    type: String,
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
