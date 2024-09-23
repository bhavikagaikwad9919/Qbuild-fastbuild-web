import * as Actions from '../actions';
import _ from '@lodash';
import { actions } from 'react-table';
const initialState = {
	entities: null,
	searchText: '',
	details: '',
	report: '',
	detailReport: '',
	routes: 'Dashboard',
	inventories: [],
	inventory: '',
	projectDialog: {
		Dialogtype: 'new',
		props: {
			open: false
		},
		data: null,
		type: 'edit'
	}
};

const projectsReducer = function (state = initialState, action) {
	switch (action.type) {
		case Actions.GET_PROJECTS:
			return {
				...state,
				entities: _.keyBy(action.payload, '_id')
			};

		case Actions.GET_PROJECT_DETAILS:
			return {
				...state,
				details: action.payload
			};

		case Actions.GET_INVENTORIES:
			return {
				...state,
				inventories: action.payload
			};

		case Actions.GET_INVENTORY:
			return {
				...state,
				inventory: action.payload
			};

		case Actions.GET_DAILY_REPORT:
			return {
				...state,
				report: action.payload
			};

		case Actions.GET_DETAIL_REPORT:
			return {
				...state,
				detailReport: action.payload
			};

		case Actions.ROUTES:
			return {
				...state,
				routes: action.payload
			};

		case Actions.GET_TEAM:
			return {
				...state,
				team: action.payload
			};

		case Actions.GET_PLANS:
			return {
				...state,
				plans: action.payload
			};

		case Actions.BACK: {
			return {
				...state,
				searchText: '',
				details: '',
				routes: 'Dashboard',
				team: '',
				plans: ''
			};
		}

		case Actions.SET_SEARCH_TEXT: {
			return {
				...state,
				searchText: action.searchText
			};
		}
		case Actions.OPEN_NEW_DIALOG: {
			return {
				...state,
				projectDialog: {
					Dialogtype: 'new',
					props: {
						open: true
					},
					data: null,
					type: 'new'
				}
			};
		}
		case Actions.CLOSE_NEW_DIALOG: {
			return {
				...state,
				projectDialog: {
					Dialogtype: 'new',
					props: {
						open: false
					},
					data: null,
					type: 'new'
				}
			};
		}
		case Actions.OPEN_EDIT_DIALOG: {
			return {
				...state,
				projectDialog: {
					Dialogtype: 'edit',
					props: {
						open: true
					},
					data: action.data,
					type: 'edit'
				}
			};
		}
		case Actions.CLOSE_EDIT_DIALOG: {
			return {
				...state,
				projectDialog: {
					Dialogtype: 'edit',
					props: {
						open: false
					},
					data: null,
					type: 'edit'
				}
			};
		}
		default:
			return state;
	}
};

export default projectsReducer;
