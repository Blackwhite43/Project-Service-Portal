const Problem = require(`../models/problemModel`);
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setCustomerIds = (req, res, next) => {
  // ALLOW NESTED ROUTES
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.getUserProblems = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  const problem = await Problem.find({
    user: req.params.id
  });
  res.status(200).json({
    status: 'success',
    data: {
      data: problem
    }
  });
})

exports.getAllProblems = factory.getAll(Problem);
exports.getProblem = factory.getOne(Problem);
exports.createProblem = factory.createOne(Problem);
exports.deleteProblem = factory.deleteOne(Problem);
exports.updateProblem = factory.updateOne(Problem);
