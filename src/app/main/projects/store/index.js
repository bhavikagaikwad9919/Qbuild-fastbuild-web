import { combineReducers } from '@reduxjs/toolkit';
import projects from './projectsSlice';
// import user from './userSlice';

const reducer = combineReducers({
	projects
});

export default reducer;
