import { FETCH_USER } from './types';
import axios from 'axios';

export const fetchUser = () => {
  return async dispatch => {
    const res = await axios.get('/api/logged-in-user');
    dispatch({ type: FETCH_USER, payload: res.data });
  };
};

export const setPassword = (password, history) => {
  return async dispatch => {
    const res = await axios.post('/api/user/password', { password });
    dispatch({ type: FETCH_USER, payload: res.data });
    history.push('/home');
  };
};
