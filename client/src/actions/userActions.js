import { FETCH_USER } from './types';
import axios from 'axios';

export const fetchUser = () => {
  return async dispatch => {
    const res = await axios.get('/api/current-user');
    dispatch({ type: FETCH_USER, payload: res.data });
  };
};
