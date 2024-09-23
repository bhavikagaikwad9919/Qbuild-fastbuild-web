import { combineReducers } from '@reduxjs/toolkit';
import organizations from './organizationSlice';

const reducer = combineReducers({
	organizations
});

export default reducer;
