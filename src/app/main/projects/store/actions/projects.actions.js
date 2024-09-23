import axios from 'axios';
import history from '@history';
import { showMessage } from 'app/store/fuse/messageSlice';
import constants from 'app/main/config/constants';

export const GET_PROJECTS = '[PROJECTS] GET PROJECTS';
export const SET_SEARCH_TEXT = '[PROJECTS] SET SEARCH TEXT';
export const GET_PROJECT_DETAILS = '[PROJECTS] GET PROJECT DETAILS';
export const GET_INVENTORIES = '[PROJECTS] GET INVENTORIES';
export const GET_INVENTORY = '[PROJECTS] GET INVENTORY';
export const DELETE_DOCUMENT = '[PROJECTS] DELETE DOCUMENT';
export const GET_DAILY_REPORT = '[PROJECTS] GET DAILY REPORT';
export const GET_DETAIL_REPORT = '[PROJECTS] GET DETAIL REPORT';
export const GET_TEAM = '[PROJECTS] GET TEAM';
export const GET_PLANS = '[PROJECTS] GET PLANS';
export const ROUTES = '[PROJECTS] ROUTES';
export const BACK = '[PROJECTS] BACK';
export const FETCH = '[PROJECTS] FETCH';
export const OPEN_EDIT_DIALOG = '[PROJECTS] OPEN EDIT DIALOG';
export const OPEN_NEW_DIALOG = '[PROJECTS] OPEN NEW DIALOG';
export const CLOSE_NEW_DIALOG = '[PROJECTS] CLOSE NEW DIALOG';
export const CLOSE_EDIT_DIALOG = '[PROJECTS] CLOSE EDIT DIALOG';
export const ADD_TEAM = '[PROJECTS] ADD TEAM';
export const UPDATE_TEAM = '[PROJECTS] UPDATE TEAM';
export const DELETE_TEAM = '[PROJECTS] DELETE TEAM';

export function getProjects() {
	const request = axios.get(constants.BASE_URL + '/projects');

	return dispatch =>
		request.then(response => {
			console.log('resss', response.data);
			dispatch({
				type: GET_PROJECTS,
				payload: response.data.data.data
			});

			if (!response.data.data.data.length) {
				history.push({
					pathname: `/projects/add`
				});
			}
			return response;
		});
}

export function getProject(params) {
	const request = axios.get(`${constants.BASE_URL}/projects/${params}`);

	return dispatch =>
		request.then(response => {
			// history.push({
			//   pathname: `/projects/${params}`,
			// });

			dispatch({
				type: GET_PROJECT_DETAILS,
				payload: response.data.data
			});
		});
}

export function addProject(data) {
	const request = axios.post(constants.BASE_URL + '/projects/create', data);
	return dispatch => {
		request.then(response => {
			if (response.data.code === 200) {
				dispatch(getProjects()).then(() => {
					console.log('going to projrcts');
					history.push({
						pathname: '/projects'
					});

					dispatch(
						showMessage({
							message: 'Project Added Successfully',
							variant: 'success'
						})
					);
				});
			} else {
				dispatch(
					showMessage({
						message: response.data.message,
						variant: 'error'
					})
				);
			}
		});
	};
}

export function listInventories(projectId) {
	const request = axios.get(`${constants.BASE_URL}/projects/${projectId}/inventory/`);
	return dispatch =>
		request.then(response => {
			dispatch({
				type: GET_INVENTORIES,
				payload: response.data.data
			});
			return response;
		});
}

export function getInventory(projectId, inventoryId) {
	const request = axios.get(`${constants.BASE_URL}/projects/${projectId}/inventory/${inventoryId}`);
	return dispatch =>
		request.then(response => {
			dispatch({
				type: GET_INVENTORY,
				payload: response.data.data
			});
			return response.data;
		});
}

export function addInventory(projectId, type, unit) {
	const request = axios.post(`${constants.BASE_URL}/inventory-types/add`, {
		projectId: projectId,
		type: type,
		unit: unit
	});
	return dispatch =>
		request.then(response => {
			if (response.data.code === 200) {
				dispatch(listInventories(projectId)).then(() => {
					dispatch(
						showMessage({
							message: response.data.message,
							variant: 'success'
						})
					);
				});
			} else {
				dispatch(
					showMessage({
						message: response.data.message,
						variant: 'error'
					})
				);
			}
		});
}

export function updateInventory(projectId, inventoryId, type, quantity) {
	const request = axios.put(`${constants.BASE_URL}/projects/${projectId}/inventory/${inventoryId}`, {
		transactionType: type,
		quantity: parseInt(quantity)
	});
	return dispatch =>
		request.then(response => {
			console.log('response', response);

			if (response.data.code === 200) {
				dispatch(listInventories(projectId)).then(() => {
					dispatch(getInventory(projectId, inventoryId)).then(() => {
						dispatch(
							showMessage({
								message: response.data.message,
								variant: 'success'
							})
						);
					});
				});

				return response;
			}
		});
}

export function deleteTransaction(projectId, inventoryId, transactionId) {
	const request = axios.delete(
		`${constants.BASE_URL}/projects/${projectId}/inventory/${inventoryId}/${transactionId}`
	);
	return dispatch =>
		request.then(response => {
			if (response.data.code === 200) {
				dispatch(
					showMessage({
						message: response.data.message,
						variant: 'success'
					})
				);
			}
		});
}

export function deleteDocument(projectId, documentId) {
	const request = axios.delete(`${constants.BASE_URL}/projects/${projectId}/documents/${documentId}`);
	return dispatch =>
		request.then(response => {
			if (response.data.code === 200)
				dispatch(getProject(projectId)).then(() => {
					dispatch(
						showMessage({
							message: response.data.message,
							variant: 'success'
						})
					);
				});
			return response;
		});
}

export function getReport(params) {
	const request = axios.get(`${constants.BASE_URL}/projects/${params}/reports`);

	return dispatch =>
		request.then(response => {
			dispatch({
				type: GET_DAILY_REPORT,
				payload: response.data.data
			});
		});
}

export function getDetailReport(params, reportId) {
	const request = axios.get(`${constants.BASE_URL}/projects/${params}/report/${reportId}`);

	return dispatch =>
		request.then(response => {
			dispatch({
				type: GET_DETAIL_REPORT,
				payload: response.data.data
			});
		});
}

export function fetchReport(projectId, row) {
	return dispatch => {
		//console.log('22222');
		// getDetailReport(projectId, row._id)
		// return dispatch => {

		//   dispatch(OPEN_EDIT_DIALOG(row));
		//   console.log('1111');
		// }

		setTimeout(() => {
			console.log('1111');
			dispatch(getDetailReport(projectId, row._id)).then(() => {
				dispatch(OPEN_EDIT_DIALOG(row));
			}, 2000);

			// dispatch(getDetailReport(projectId, row._id)).then(() => {
			//   dispatch(OPEN_EDIT_DIALOG(row));
			// });
		});
	};
}

export function routes(params) {
	return {
		type: ROUTES,
		payload: params
	};
}

export function getTeam(params) {
	const request = axios.get(`${constants.BASE_URL}/projects/${params}/team`);

	return dispatch =>
		request.then(response => {
			dispatch({
				type: GET_TEAM,
				payload: response.data
			});
		});
}

export function getPlans(params) {
	const request = axios.get(`${constants.BASE_URL}/projects/${params}/plan`);

	return dispatch =>
		request.then(response => {
			dispatch({
				type: GET_PLANS,
				payload: response.data.data
			});
		});
}

export function back() {
	return {
		type: BACK,
		payload: ''
	};
}

export function setSearchText(event) {
	return {
		type: SET_SEARCH_TEXT,
		searchText: event.target.value
	};
}

export function updateTeam(id, memberId, team) {
	return dispatch => {
		const request = axios.put(`${constants.BASE_URL}/projects/${id}/team/${memberId}/update`, {
			status: team.status,
			role: team.role
		});
		return request.then(response =>
			Promise.all([
				dispatch({
					type: UPDATE_TEAM
				})
			]).then(() =>
				dispatch(getProject(id))
					.then(() => dispatch(routes('Team')))
					.then(() =>
						dispatch(
							showMessage({
								message: 'Team updated successfully',
								variant: 'success'
							})
						)
					)
			)
		);
	};
}

export function addTeam(id, team) {
	return dispatch => {
		const request = axios.post(`${constants.BASE_URL}/projects/${id}/team/add`, {
			name: team.name,
			email: team.email,
			contact: team.contact,
			role: team.role
		});
		return request.then(response =>
			Promise.all([
				dispatch({
					type: ADD_TEAM
				})
			]).then(() =>
				dispatch(getProject(id))
					.then(() => dispatch(routes('Team')))
					.then(() =>
						dispatch(
							showMessage({
								message: 'New Team Member Added',
								variant: 'success'
							})
						)
					)
			)
		);
	};
}

export function deleteTeam(id, memberId) {
	return dispatch => {
		const request = axios.delete(`${constants.BASE_URL}/projects/${id}/team/${memberId}`);

		return request.then(response => {
			console.log('response', response);
			if (response.data.message === 'Member Deleted From Team') {
				Promise.all([
					dispatch({
						type: DELETE_TEAM
					})
				]).then(() =>
					dispatch(getProject(id))
						.then(() => dispatch(routes('Team')))
						.then(() =>
							dispatch(
								showMessage({
									message: 'Member Deleted From Team',
									variant: 'success'
								})
							)
						)
				);
			} else {
				dispatch(
					showMessage({
						message: `${response.data.message}`,
						variant: 'error'
					})
				);
			}
		});
	};
}

export function openEditDialog(data) {
	return {
		type: OPEN_EDIT_DIALOG,
		data
	};
}

export function openNewDialog() {
	return {
		type: OPEN_NEW_DIALOG
	};
}

export function closeNewDialog() {
	return {
		type: CLOSE_NEW_DIALOG
	};
}

export function closeEditDialog() {
	return {
		type: CLOSE_EDIT_DIALOG
	};
}
