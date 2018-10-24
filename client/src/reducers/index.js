import { combineReducers } from 'redux';
import authReducer from './authReducer';
import accountReducer from './accountReducer';
import creditCardReducer from './creditCardReducer';

export default combineReducers({
  auth: authReducer,
  account: accountReducer,
  creditCard: creditCardReducer
});
