const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { checkAuth } = require('../middlewares/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', checkAuth(), userController.logout);
router.get('/me', checkAuth(), userController.getOwnInfo);
router.patch('/me', checkAuth(), userController.updateOwnInfo);
router.delete('/me', checkAuth(), userController.deleteOwnAccount);
router.patch('/password', checkAuth(), userController.updateOwnPassword);
/*
router.post('/apply', checkAuth(), userController.applyForCreator);
*/
module.exports = router;
