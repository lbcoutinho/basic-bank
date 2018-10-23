import { FETCH_CREDIT_CARDS, FETCH_CREDIT_CARD_BY_ID } from '../actions/types';

const initialState = {
  list: null,
  card: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_CREDIT_CARDS:
      return { ...state, list: action.payload, card: null };
    case FETCH_CREDIT_CARD_BY_ID:
      return { ...state, list: null, card: action.payload };
    default:
      return state;
  }
}
