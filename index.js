import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import posts from './router/posts.js'
import users from './router/users.js'
import auth from './router/auth.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const URI = process.env.DATABASE_URL

app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));
app.use(cors());
app.use(cookieParser());

app.use(express.static('images'))

app.use('/posts', posts)
app.use('/users', users)
app.use('/auth', auth);

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to db');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    });
  }).catch((err) => {
    console.log('err', err);
  })

