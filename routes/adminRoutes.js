const express = require('express');
const router = express.Router();
const {
  protect,
  authorize
} = require('../middleware/auth');
const {
  getUsers
} = require('../controllers/adminController');

router.use(protect);
router.use(authorize('admin'));

router.route('/users')
  .get(getUsers);

module.exports = router;