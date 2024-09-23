import { combineReducers } from '@reduxjs/toolkit';
import notification from './notificationSlice';

const reducer = combineReducers({
	notification
});

export default reducer;
