const Problem = require(`../models/problemModel`);
const factory = require('./handlerFactory');

exports.setCustomerIds = (req, res, next) => {
  // ALLOW NESTED ROUTES
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllProblems = factory.getAll(Problem);
exports.getProblem = factory.getOne(Problem);
exports.createProblem = factory.createOne(Problem);
exports.deleteProblem = factory.deleteOne(Problem);
exports.updateProblem = factory.updateOne(Problem);
