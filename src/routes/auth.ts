import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Datastore from 'nedb';

import dotenv from 'dotenv';
dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET ?? '';

const router = Router();

// For this demo I used a simple in memory db (would never do this in production).
// This is just the database that holds the users to get the authentication working
const db = new Datastore({ filename: './src/db/users.db', autoload: true });

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    db.findOne({ username }, async (err, user) => {
      // The login should never tell what information is correct/incorrect. Simple security feature.
      const error = new Error('Invalid credentials.');
      if (err) throw error;

      // Bcrypt is a library that hashes the password and checks the password against the hash
      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (!passwordsMatch) throw error;

      // AuthUser is just a basic interface I made for the authenticated user, which is also the payload that the jwt holds
      const payload: AuthUser = {
        id: user._id,
        username: username,
      };

      // We sign the jwt token with our secret and give it an expiry date. Since this is a demo and there are no refresh tokens this is quite long living token
      const token = jwt.sign(payload, TOKEN_SECRET, { expiresIn: '1d' });

      // Successful login sends the user the token and payload which is the user info (id and username in this case)
      return res.json({ message: 'Login successful.', token, payload });
    });
  } catch (error) {
    // If there are any errors we set the response status and forward the error with express frameworks next function to our error handler
    res.status(422);
    return next(error);
  }
});

// Out of scope, but I created the register route simply so that I could create user with a hashed password (we don't like those plain text passwords do we?)
router.post('/register', async (req, res, next) => {
  const { username, password } = req.body;

  db.findOne({ username }, async (err, user) => {
    try {
      if (err) throw err;

      if (user) throw new Error('Username is already in use.');

      // hash the password
      const hash = await bcrypt.hash(password, 12);
      db.insert({ username, password: hash });

      return res.json({ message: 'Registration successful.' });
    } catch (error) {
      res.status(422);
      return next(error);
    }
  });
});

export default router;
