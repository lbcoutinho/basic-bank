import { FETCH_CREDIT_CARD_LIST, FETCH_CREDIT_CARD } from './types';
import axios from 'axios';

export const fetchCreditCardList = () => {
  return async dispatch => {
    const res = await axios.get('/api/credit-card');
    dispatch({ type: FETCH_CREDIT_CARD_LIST, payload: res.data });
  };
};

export const fetchCreditCard = id => {
  return async dispatch => {
    const res = await axios.get(`/api/credit-card/${id}`);
    dispatch({ type: FETCH_CREDIT_CARD, payload: res.data });
  };
};

export const createCreditCard = (newCard, history) => {
  return async dispatch => {
    await axios.post('/api/credit-card', newCard);
    history.push('/creditcard');
  };
};

export const deleteCreditCard = (id, history) => {
  return async dispatch => {
    await axios.delete(`/api/credit-card/${id}`);
    history.push('/creditcard');
  };
};
