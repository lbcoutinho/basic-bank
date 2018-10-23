import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import authReducer from './authReducer';
import accountReducer from './accountReducer';
import creditCardReducer from './creditCardReducer';

export default combineReducers({
  auth: authReducer,
  account: accountReducer,
  creditCard: creditCardReducer,
  form: reduxForm
});
