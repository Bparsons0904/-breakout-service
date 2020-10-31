import mongoose, { Schema } from 'mongoose';

import bcrypt from 'bcrypt';
import isEmail from 'validator/lib/isEmail';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [isEmail, 'No valid email address provided.'],
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    maxlength: 60,
  },
  role: {
    type: String,
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  completedRooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  successfulRooms: {
    type: Number,
  },
  failedRooms: {
    type: Number,
  },
});

// Find user by username, then email if username not found
userSchema.statics.findByLogin = async function (login) {
  let user = await this.findOne({
    username: login,
  });

  if (!user) {
    user = await this.findOne({ email: login });
  }

  return user;
};

// Before saving, hash password
userSchema.pre('save', async function () {
  if (this.password.slice(0, 7) != '$2b$10$') {
    console.log(this.password.slice(0, 7));
    this.password = await this.generatePasswordHash();
  }
});

// Hash password
userSchema.methods.generatePasswordHash = async function () {
  const saltRounds = 10;
  return await bcrypt.hash(this.password, saltRounds);
};

// Validate entered password
userSchema.methods.validatePassword = async function (password) {
  console.log(password, this.password);
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
