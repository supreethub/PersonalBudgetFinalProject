const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('./DB');
const userRoute = require('./Route/userRoutes');

const PORT = process.env.PORT || 8081;

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);



mongoose.connect(config.DB).then(
  () => { console.log('Database is connected') },
  err => { console.log('Cannot connect to the database' + err) }
);

const app = express();
const path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.use('/api/users', userRoute);

app.get('/hello', function (res, req) {
  res.send('hello world')
})

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
