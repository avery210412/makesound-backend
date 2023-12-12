const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const { checkAuth } = require('../middlewares/auth');

router.post('/', checkAuth(), followController.createFollowing);
router.delete('/:id', checkAuth(), followController.deleteFollowing);

module.exports = router;
