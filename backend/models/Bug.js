const mongoose = require('mongoose');
const STATUS = require('../constants/status');

const bugSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  bountyAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  isConfigurable: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: [STATUS.OPEN, STATUS.IN_REVIEW, STATUS.CLOSED],
    default: STATUS.OPEN,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

bugSchema.virtual('submissions', {
  ref: 'Submission',
  localField: '_id',
  foreignField: 'bugId',
  options: { sort: { createdAt: -1 } }
});

bugSchema.set('toJSON', { virtuals: true });
bugSchema.set('toObject', { virtuals: true });
bugSchema.set('strictPopulate', false);

module.exports = mongoose.model('Bug', bugSchema);
