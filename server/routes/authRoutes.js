const express = require('express');
const router = express.Router();
const cors = require('cors')
const { test, registerUser, loginUser, getProfile, logoutUser, forgotPassword, resetPassword, updateSecretAnswer } = require('../controllers/authControllers')

//middleware
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3000'
    })
)

router.get('/', test)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', getProfile)
router.post('/logout', logoutUser)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/update-secret-answer', updateSecretAnswer)

module.exports = router