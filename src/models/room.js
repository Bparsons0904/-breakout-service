import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  active: {
    type: Boolean,
  },
  website: {
    type: String,
  },
  successes: {
    type: Number,
  },
  attempts: {
    type: Number,
  },
  fastest: {
    type: Number,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
