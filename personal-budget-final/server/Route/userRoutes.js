const express = require('express')
const user = require('../Controller/userController')
const router = express.Router()

const { authMiddleware } = require('../Controller/userController')

router.post('/signup', user.signup)

router.post('/login', user.login)

router.get('/profile', authMiddleware, function (req, res) {
  res.json({ 'access': true })
})

router.put('/addAmtSpent', user.budgetUsed)
router.put('/submit', user.addBudget)
router.get('/budget', user.getBudget)


module.exports = router
