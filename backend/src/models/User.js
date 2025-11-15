import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true
  },
  encryptedPrivateKey: {
    type: String,
    required: true
  },
  isTwoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String,
    default: null
  },
  emailOtpHash: {
    type: String,
    default: null
  },
  emailOtpExpiry: {
    type: Date,
    default: null
  },
  accountType: {
    type: String,
    enum: ['custodial', 'non-custodial'],
    default: 'custodial'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);

export default User;