const express = require('express');
const problemController = require('../controllers/problemController');
const authController = require('../controllers/authController');

//Routes
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(problemController.getAllProblems)
  .post(
    authController.restrictTo('customer'),
    problemController.setCustomerIds,
    problemController.createProblem
  );

router
  .route('/:id')
  .get(problemController.getProblem)
  .delete(problemController.deleteProblem)
  .patch(problemController.updateProblem);

module.exports = router;
