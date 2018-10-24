import { FETCH_CREDIT_CARD_LIST, FETCH_CREDIT_CARD } from '../actions/types';

const initialState = {
  list: null,
  card: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_CREDIT_CARD_LIST:
      return { ...state, list: action.payload, card: null };
    case FETCH_CREDIT_CARD:
      return { ...state, list: null, card: action.payload };
    default:
      return state;
  }
}
