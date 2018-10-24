import { FETCH_ACCOUNT, FETCH_CONTACT_LIST, NEW_CONTACT } from './types';
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

export const deleteContact = (id) => {
  return async dispatch => {
    await axios.delete(`/api/account/contact/${id}`);
    // Dispatch empty payload to trigger the loading gif
    dispatch({ type: FETCH_CONTACT_LIST, payload: {} });
    // Fetch contact list after delete
    const res = await axios.get('/api/account/contact');
    dispatch({ type: FETCH_CONTACT_LIST, payload: res.data });
  };
};
