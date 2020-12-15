const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = 'mongodb://localhost:27017/personalBudgetDB'
const userRoute = require('./APIs/Route/userRoutes');
//const budgetRoute = require('./routes/BudgetRoute')
const PORT = process.env.PORT || 8081;

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;

mongoose.connect(config).then(
  () => { console.log('Database is connected') },
  err => { console.log('Cannot connect to the database' + err) }
);

const app = express();
const path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors())
app.use('/api/users', userRoute);

app.get('/hello', function (req, res) {
  res.send('hello world')
})

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
