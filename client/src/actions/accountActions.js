import { FETCH_ACCOUNT } from './types';
import axios from 'axios';

export const fetchAccount = () => {
  return async dispatch => {
    const res = await axios.get('/api/account');
    dispatch({ type: FETCH_ACCOUNT, payload: res.data });
  };
};
