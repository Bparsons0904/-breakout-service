import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
});

const Company = mongoose.model('Company', companySchema);

export default Company;
