const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const express = require('express');
const catchAsync = require('../catchAsync'); // Gunakan ini, in case ada error maka tidak akan crash app
const dotenv = require('dotenv');

const app = express();
const router = express.Router(); // use this later when splitting the route
dotenv.config({ path: './config.env' });

app.use(express.json());

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(() => console.log('DB connection successful!'));

//Model data
const user_input_data = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
    minLength: [5, 'A name must have less or equal than 5 characters'],
    maxLength: [40, 'A name must have less or equal than 40 characters'],
  },
  email: {
    type: String,
    required: [true, 'User must have an email'],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'An email must be valid'],
  },
  password: {
    //Unaccessible in database
    type: String,
    required: [true, 'User must have a password'],
    validate: [validator.isStrongPassword],
    select: false,
  },
  confirm_password: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (element) {
        return element === this.password;
      },
      message: 'Password is not same!',
    },
  },
  problem_name: {
    type: String,
    required: [true, 'User must input problem name'],
  },
  problem_description: {
    type: String,
    minLength: [10, 'Problem Description must at least have 10 characters'],
    required: [true, 'User must input problem description'],
  },
  problem_priority: {
    type: String,
    required: [true, 'Please input Problem Priority'],
    enum: {
      values: ['urgent', 'normal'],
      message: 'Priority is either: urgent or normal',
    },
  },
  problem_photo: [String],
  person_in_charge: {
    type: String,
    default: 'TBD',
  },
  problem_status: {
    type: String,
    enum: {
      values: ['open', 'closed', 'process'],
    },
    default: 'open',
  },
  estimated_time: {
    type: String,
    default: 'TBD',
  },
});
user_input_data.pre('save', async function (next) {
  //Only run this function when password is modified
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.confirm_password = undefined;
  next();
});
user_input_data.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model('User', user_input_data);

//User Input
const create_data = catchAsync(async (req, res) => {
  const new_user = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      user: new_user,
    },
  });
  //console.log(new_user);
});
const get_data_customer = catchAsync(async (req, res) => {
  //const {query} = new APIFeatures(User.find(), req.query).filter().limiting().pagination().sorting();
  const data = await User.find(
    {},
    {
      _id: 0,
      problem_name: 1,
      problem_description: 1,
      problem_priority: 1,
      problem_photo: 1,
      person_in_charge: 1,
      problem_status: 1,
      estimated_time: 1,
    }
  );
  //const data = await query;
  console.log(data);
  res.status(200).json({
    status: 'success',
    results: data.length,
    data: {
      data,
    },
  });
});
const get_data_cls = catchAsync(async (req, res) => {
  //const {query} = new APIFeatures(User.find(), req.query).filter().limiting().pagination().sorting();
  const data = await User.find({}, { password: 0, confirm_password: 0 });
  //const data = await query;
  console.log(data);
  res.status(200).json({
    status: 'success',
    results: data.length,
    data: {
      data,
    },
  });
});
const update_data = catchAsync(async (req, res) => {
  const new_data = await User.findOneAndUpdate(req.params.id, {
    person_in_charge: req.body.person_in_charge,
    problem_status: req.body.problem_status,
    estimated_time: req.body.estimated_time,
  });
  if (!new_data) {
    return next(new AppError('No problems found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user: new_data,
    },
  });
});
app.route('/problems').post(create_data); // Route OK
app.route('/update-data/:id').patch(update_data);
app.route('/check-progress-customer').get(get_data_customer);
app.route('/check-problems-cls').get(get_data_cls);

//Server
const port = process.env.PORT || 3000; // Nyalakan server dulu
const server = app.listen(port, () => {
  console.log(`App Running on port ${port}...`);
});
