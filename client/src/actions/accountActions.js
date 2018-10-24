import { FETCH_ACCOUNT, FETCH_CONTACT_LIST, NEW_CONTACT, TRANSFER_UPDATE } from './types';
import axios from 'axios';

export const fetchAccount = () => {
  return async dispatch => {
    const res = await axios.get('/api/account');
    dispatch({ type: FETCH_ACCOUNT, payload: res.data });
  };
};

export const fetchContacts = () => {
  return async dispatch => {
    const res = await axios.get('/api/account/contact');
    dispatch({ type: FETCH_CONTACT_LIST, payload: res.data });
  };
};

export const createContact = (newContact, history) => {
  return async dispatch => {
    try {
      await axios.post('/api/account/contact', newContact);
      dispatch({ type: NEW_CONTACT, payload: null });
      history.push('/contact');
    } catch (err) {
      const payload = { email: newContact.email, error: err.response.data };
      dispatch({ type: NEW_CONTACT, payload });
    }
  };
};

export const deleteContact = id => {
  return async dispatch => {
    await axios.delete(`/api/account/contact/${id}`);
    // Dispatch empty payload to trigger the loading gif
    dispatch({ type: FETCH_CONTACT_LIST, payload: {} });
    // Fetch contact list after delete
    const res = await axios.get('/api/account/contact');
    dispatch({ type: FETCH_CONTACT_LIST, payload: res.data });
  };
};

export const newTransfer = () => {
  return async dispatch => {
    const payload = { transferValidation: null, creditCardList: null };
    dispatch({ type: TRANSFER_UPDATE, payload });
  };
};

export const validateTransfer = transfer => {
  return async dispatch => {
    const validation = await axios.put('/api/account/validate-transfer', transfer);
    const payload = { transferValidation: validation.data };

    // If response contains useCreditCard message then get user credit card list
    if (validation.data.useCreditCard) {
      const creditCardList = await axios.get('/api/credit-card');
      payload.creditCardList = creditCardList.data;
    }
    dispatch({ type: TRANSFER_UPDATE, payload });
  };
};

export const executeTransfer = (transfer, history) => {
  return async dispatch => {
    await axios.put('/api/account/transfer', transfer);
    if (transfer.creditCardId) {
      history.push(`/creditcard/details/${transfer.creditCardId}`);
    } else {
      history.push('/home');
    }
    const payload = { transferValidation: null, creditCardList: null };
    dispatch({ type: TRANSFER_UPDATE, payload });
  };
};
