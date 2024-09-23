import * as Actions from '../actions';
import _ from '@lodash';

const initialState = {
  report: '',
  detailReport: '',
  vendors: '',
  material: [],
  labour: [],
  attachments: [],
  files: '',
};

const reportsReducer = function (state = initialState, action) {
  switch (action.type) {
    case Actions.GET_DAILY_REPORT:
      return {
        ...state,
        report: action.payload,
      };

    case Actions.GET_DETAIL_REPORT:
      return {
        ...state,
        detailReport: action.payload,
        material: action.payload.inventory,
        labour: action.payload.labour,
        attachments: action.payload.attachments,
      };

    case Actions.GET_VENDORS:
      return {
        ...state,
        vendors: action.payload,
      };

    case Actions.UPDATE_MATERIAL:
      return {
        ...state,
        material: action.payload,
      };
    case Actions.UPDATE_LABOUR:
      return {
        ...state,
        labour: action.payload,
      };
    case Actions.UPDATE_ATTACHMENTS:
      return {
        ...state,
        attachments: action.payload,
      };
    case Actions.ADD_FILES:
      return {
        ...state,
        files: action.payload,
      };
    case Actions.CLEAR_STATE:
      return {
        ...state,
        material: [],
        labour: [],
        attachments: [],
        files: '',
      };
    default:
      return state;
  }
};

export default reportsReducer;
