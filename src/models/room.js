import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  intro: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  successes: {
    type: Number,
    required: true,
  },
  attempts: {
    type: Number,
    required: true,
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
