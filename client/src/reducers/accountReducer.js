import { FETCH_ACCOUNT, FETCH_CONTACT_LIST, NEW_CONTACT } from '../actions/types';

const initialState = {
  data: null,
  contacts: null,
  contact: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_ACCOUNT:
      return { ...state, data: action.payload };
    case FETCH_CONTACT_LIST:
      return { ...state, contacts: action.payload.contacts };
    case NEW_CONTACT:
      return { ...state, contact: action.payload, contacts: null };
    default:
      return state;
  }
}
