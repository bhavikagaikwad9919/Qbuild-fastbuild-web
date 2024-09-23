import { combineReducers } from '@reduxjs/toolkit';
import sites from './sitesSlice';

const reducer = combineReducers({
	sites
});

export default reducer;
