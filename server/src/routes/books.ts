import axios from 'axios';
import { Router } from 'express';

const router = Router();

const openLibraryAPIUrl = 'https://openlibrary.org/api/books?';

router.get('/', async (req, res, next) => {
  // Express frameworks way of getting the query parameters from the request
  const { isbn } = req.query;

  try {
    // We don't want to send the request forward if the ISBN is not defined
    if (!isbn) throw new Error('ISBN needed.');

    // We construct a query object with the wanted query parameters
    const queryObject = {
      format: 'json',
      jscmd: 'data',
      bibkeys: `ISBN:${isbn}`,
    };

    // this just constructs a query string from the query object so that we can easily use it in the url, we could also manually write this if we wanted
    // I just think this is a bit of a clearer/cleaner way of doing it
    const queryString = new URLSearchParams(queryObject);

    // axios is a library that creates requests to specified url
    const response = await axios.get(`${openLibraryAPIUrl}${queryString}`);
    return res.json(response.data);
  } catch (error) {
    // error.response is how axios hadles error responses, so we need to check if the error is an axios error or server error
    if (error.response) {
      res.status(error.response.status);
      return next(error.response.data);
    }
    res.status(422);
    return next(error);
  }
});

export default router;
