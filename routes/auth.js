const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth');

router.post('/login', controller.login)
router.post('/register', controller.register)
router.post('/getUserData', controller.getUserData)
module.exports = router;