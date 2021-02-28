import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import middleware from './middleware';
import books from './routes/books';
import movies from './routes/movies';
import auth from './routes/auth';

const app = express();

// Helmet is a nice package that includes some basic security headers (check the response headers to see which ones it includes/excludes)
app.use(helmet());

// Cors handler for this server (now allows all origins)
app.use(cors());

// JSON parser
app.use(express.json());

// Sets the user on the request if the token is valid
app.use(middleware.checkTokenSetUser);

// rate limiting and slow down middleware
app.use(middleware.rateLimitRequest);
app.use(middleware.slowDownRequest);

// Routes
app.use('/getMovie', middleware.isLoggedIn, movies);
app.use('/getBook', middleware.isLoggedIn, books);
app.use('/auth', auth);

// Basic error handlers
app.use(middleware.notFoundHandler);
app.use(middleware.errorHandler);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});
