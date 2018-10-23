import { FETCH_CREDIT_CARDS, FETCH_CREDIT_CARD_BY_ID } from './types';
import axios from 'axios';

export const fetchCreditCards = () => {
  return async dispatch => {
    const res = await axios.get('/api/credit-card');
    dispatch({ type: FETCH_CREDIT_CARDS, payload: res.data });
  };
};

export const fetchCreditCardById = id => {
  return async dispatch => {
    const res = await axios.get(`/api/credit-card/${id}`);
    dispatch({ type: FETCH_CREDIT_CARD_BY_ID, payload: res.data });
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
