const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxlength: [50, 'A title must have less or equal then 50 characters'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
  },
  media: String,
  status: {
    type: String,
    default: 'open',
    enum: {
      values: ['open', 'closed', 'process'],
      message: 'Status is either: open, process or closed',
    },
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
    // If possible create pre middleware to calculate Date.Now() - Date()
  },
  person_in_charge: {
    type: String,
    default: 'TBD',
  },
  pic_action: {

  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Problem must belong to a user.'],
  },
});

// This middleware will run when we access the find query, before the others query run this function will be run first
problemSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name role",
  });
  next();
});


const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
