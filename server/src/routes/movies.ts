import { Router } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

const router = Router();
dotenv.config();

const OMDB_API_KEY = process.env.OMDB_API_KEY;

const OMDbAPIUrl = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&type=movie&`;

router.get('/', async (req, res, next) => {
  const { title, year, plot } = req.query;

  try {
    // since the query parameters can be undefined on empty, we need to cast them as strings, beacause new URLSearchParams requires them to be strings
    const queryObject = {
      t: title as string,
      y: year as string,
      plot: plot as string,
    };

    // Even though we filter out the undefined values the typescript parser thinks the objects might not be strings
    // so we can just filter them out so that the query string wont have undefined parameters
    const filteredQueryObject = Object.entries(queryObject).filter(
      ([key, value]) => value
    );

    // construct the query string form the query object
    const queryString = new URLSearchParams(filteredQueryObject);

    const response = await axios.get(`${OMDbAPIUrl}${queryString}`);
    return res.json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status);
      return next(error.response.data);
    }
    res.status(422);
    return next(error);
  }
});

export default router;
