const mongoose = require('mongoose');
// Validator for email
const validator = require('validator');

// SECURITY
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxlength: [50, 'A tour name must have less or equal then 50 characters'],
  },
  description: { type: String, required: [true, 'Please provide a title'] },
  status: {
    type: String,
    required: [true, 'Please provide a status'],
    enum: ['open', 'closed', 'process'],
  },
  situation: {
    type: String,
    required: [true, 'Please provide a situation'],
    enum: ['normal', 'urgent'],
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
