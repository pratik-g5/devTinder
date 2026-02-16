const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://devtinder-ui.netlify.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
const authRouter = require('./routes/authRouter');
const profileRouter = require('./routes/profileRouter');
const requestRouter = require('./routes/requestRouter');
const userRouter = require('./routes/userRouter');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

// Cached DB connection for free-tier cold starts
let cached = false;

const startServer = async () => {
  try {
    if (!cached) {
      await connectDB(); // make sure connectDB returns a promise
      cached = true;
      console.log('✅ MongoDB connected successfully');
    }

    app.listen(port, () => {
      console.log(`🚀 Server running at port ${port}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
  }
};

startServer();


// const express = require('express');
// const connectDB = require('./config/database');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');

// const app = express();
// const port = 5000;

// app.use(
//   cors({
//     origin: ['http://localhost:5173', 'https://devtinder-ui.netlify.app'],
//     credentials: true,
//     methods: ['GET', 'POST', 'PATCH', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );
// app.use(express.json());
// app.use(cookieParser());

// const authRouter = require('./routes/authRouter');
// const profileRouter = require('./routes/profileRouter');
// const requestRouter = require('./routes/requestRouter');
// const userRouter = require('./routes/userRouter');

// app.use('/', authRouter);
// app.use('/', profileRouter);
// app.use('/', requestRouter);
// app.use('/', userRouter);

// connectDB()
//   .then(() => {
//     console.log('MongoDB connected successfully');
//   })
//   .catch((err) => {
//     console.error('MongoDB connection failed:', err);
//   });

// app.listen(port, () => {
//   console.log('Server is running at port 5000');
// });
