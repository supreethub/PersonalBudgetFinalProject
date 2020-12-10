const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = mongoose.Schema

const budgetSCh = new schema ({
  title: {
    type: String,
    required: true
  },
  budgetValue: {
    type: Number,
    required: true
  },
  budgetAmount: {
    type: Number
  },
  color: {
    type: String,
    required: true
  }
})

const userSch = new schema({
  username: {
    type: String,
    min: [2, 'Username must be between 2 and 30 characters long'],
    max: [30, 'Username must be between 2 and 30 characters long']
  },
  password: {
    type: String,
    required: true,
    min: [8, 'Passwords needs to be between 8 to 32 characters long'],
    max: [32, 'Passwords needs to be between 8 to 32 characters long']
  },
  confirmPassword: {
    type: String,
    required: true,
    min: [8, 'Passwords needs to be between 8 to 32 characters long'],
    max: [32, 'Passwords needs to be between 8 to 32 characters long']
  },
  email: {
    type: String,
    min: [4, 'Email address needs to be between 4 and 64'],
    max: [64, 'Email address needs to be between 4 and 64'],
    lowercase: true,
    unique: true,
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
  },
  budgets: [budgetSCh]
});

userSch.pre('save', function(next) {
  const user = this
  if(!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt){
    if(err) {
      return res.status(422).json({
        error:'Error during gensalt hashing'
      })
    }
    bcrypt.hash(user.password, salt, function(err, hash) {
      if(err) {
        return res.status(422).json({
          error:'Error while password hash'
        })
      }
      user.password = hash
      next()
    })
  })
})

userSch.methods.hasSamePassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}
module.exports = mongoose.model('User', userSch)
