import { combineReducers } from '@reduxjs/toolkit';
import payment from './paymentSlice';

const reducer = combineReducers({
	payment
});

export default reducer;
