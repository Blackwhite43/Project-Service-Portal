const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxlength: [50, 'A tour name must have less or equal then 50 characters'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
  },
  status: {
    type: String,
    required: [true, 'Please provide a status'],
    enum: ['open', 'closed', 'process'],
    message: 'Status is either: open, process or closed',
  },
  situation: {
    type: String,
    required: [true, 'Please provide a situation'],
    enum: {
      values: ['normal', 'urgent'],
      message: 'Situation is either: normal or urgent',
    },
    default: 'normal',
  },
  completionEstimate: {
    type: Date,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user.'],
  },
});

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
