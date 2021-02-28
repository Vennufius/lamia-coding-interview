import MovieParams from '@/interfaces/movieParams';
import User from '@/interfaces/user';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000',
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default {
  async login(user: User) {
    const { data } = await instance.post('/auth/login', user);
    return data;
  },
  async getMovie(params: MovieParams) {
    const queryString = new URLSearchParams(
      Object.entries(params).filter((p) => p)
    );
    const { data } = await instance.get(`/getMovie?${queryString}`);
    return data;
  },
  async getBook(isbn: string) {
    const { data } = await instance.get(`/getBook?isbn=${isbn}`);
    return data;
  },
};
