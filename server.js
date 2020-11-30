const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");
const port = process.env.PORT || 3000;
const User = require('./model/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Connected to DB"))

//Import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts')

app.get('/api/users/data', (req, res) => {
    User.find().then(items => res.json(items));
})

//Middleware
app.use(express.json());
app.use(cors());

//Route middleware
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

app.listen(port, () => console.log("Server is running."));