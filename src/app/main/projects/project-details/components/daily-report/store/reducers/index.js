import { combineReducers } from 'redux';
import reports from './reports.reducer';
const reducer = combineReducers({
  reports,
});

export default reducer;
