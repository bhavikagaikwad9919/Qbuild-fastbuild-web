import { combineReducers } from '@reduxjs/toolkit';
import admin from './AdminSlice';

const reducer = combineReducers({
	admin
});

export default reducer;