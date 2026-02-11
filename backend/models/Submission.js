const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  proof: [{
    path: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['image', 'video', 'file'],
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    }
  }],
  bugId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bug',
    required: true,
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  winner: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Submission', submissionSchema);
