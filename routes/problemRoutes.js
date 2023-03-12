const express = require('express');
const problemController = require('../controllers/problemController');
const authController = require('../controllers/authController');

//Routes
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(problemController.getAllReviews)
  .post(
    authController.restrictTo('customer'),
    problemController.setCustomerIds,
    problemController.createReview
  );

router
  .route('/:id')
  .get(problemController.getReview)
  .delete(problemController.deleteReview)
  .patch(problemController.updateReview);

module.exports = router;
