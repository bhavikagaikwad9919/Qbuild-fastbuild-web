import axios from 'axios';
import { showMessage } from 'app/store/fuse/messageSlice';

import { ADD_TEAM } from 'app/main/projects/store/actions';
import constants from 'app/main/config/constants';

export const GET_DAILY_REPORT = 'GET DAILY REPORT';
export const GET_DETAIL_REPORT = 'GET DETAIL REPORT';
export const GET_VENDORS = 'GET VENDORS';
export const SAVE_REPORT = 'SAVE REPORT';
export const SUBMIT_REPORT = 'SUBMIT REPORT';
export const UPDATE_MATERIAL = 'UPDATE MATERIAL';
export const UPDATE_LABOUR = 'UPDATE LABOUR';
export const UPDATE_ATTACHMENTS = 'UPDATE ATTACHMENTS';
export const ADD_FILES = 'ADD FILES';
export const CLEAR_STATE = '[REPORTS] CLEAR STATE';

export function getReport(params) {
  const request = axios.get(`${constants.BASE_URL}/projects/${params}/reports`);

  return (dispatch) =>
    request.then((response) => {
      dispatch({
        type: GET_DAILY_REPORT,
        payload: response.data.data,
      });
    });
}

export function getDetailReport(params, reportId) {
  const request = axios.get(
    `${constants.BASE_URL}/projects/${params}/report/${reportId}`
  );

  return (dispatch) =>
    request.then((response) => {
      dispatch({
        type: GET_DETAIL_REPORT,
        payload: response.data.data,
      });
    });
}

export function saveReport(id, formData) {
  return (dispatch) => {
    const request = axios({
      method: 'post',
      url: `${constants.BASE_URL}/projects/${id}/report/save`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return request.then((response) =>
      Promise.all([
        dispatch({
          type: SAVE_REPORT,
        }),
      ]).then(() => {
        if (response.data.code === 200) {
          dispatch(projectActions.getReport(id)).then(() => {
            dispatch(
              showMessage({
                message: 'Report Updated Successfully',
                variant: 'success',
              })
            );
          });
        } else {
          dispatch(
            showMessage({
              message: 'Error',
              variant: 'error',
            })
          );
        }
      })
    );
  };
}

export function submitReport(id, reportId) {
  return (dispatch) => {
    const request = axios.post(
      `${constants.BASE_URL}/projects/${id}/reports/submit`,
      {
        _id: reportId,
      }
    );
    return request.then((response) => {
      Promise.all([
        dispatch({
          type: SUBMIT_REPORT,
        }),
      ]).then(() => {
        if (response.data.code === 200) {
          dispatch(getDetailReport(id, reportId)).then(() => {
            dispatch(
              showMessage({
                message: 'Report Submitted Successfully',
                variant: 'success',
              })
            );
          });
        } else {
          dispatch(
            showMessage({
              message: `${response.message}`,
              variant: 'error',
            })
          );
        }
      });
    });
  };
}

export function approveReport(id, reportId) {
  return (dispatch) => {
    const request = axios.post(
      `${constants.BASE_URL}/projects/${id}/reports/approve`,
      {
        _id: reportId,
      }
    );
    return request.then((response) => {
      Promise.all([
        dispatch({
          type: SUBMIT_REPORT,
        }),
      ]).then(() => {
        if (response.data.code === 200) {
          dispatch(getDetailReport(id, reportId)).then(() => {
            dispatch(
              showMessage({
                message: 'Report Approved Successfully',
                variant: 'success',
              })
            );
          });
        } else {
          dispatch(
            showMessage({
              message: 'Error',
              variant: 'error',
            })
          );
        }
      });
    });
  };
}

export function getVendors() {
  const request = axios.get(`${constants.BASE_URL}/vendors/list`);

  return (dispatch) =>
    request.then((response) => {
      dispatch({
        type: GET_VENDORS,
        payload: response.data.data.data,
      });
    });
}

export function updateMaterial(material) {
  return (dispatch) => {
    dispatch({
      type: UPDATE_MATERIAL,
      payload: material,
    });
  };
}

export function updateLabour(labour) {
  return (dispatch) => {
    dispatch({
      type: UPDATE_LABOUR,
      payload: labour,
    });
  };
}

export function updateAttachments(attachments) {
  return (dispatch) => {
    dispatch({
      type: UPDATE_ATTACHMENTS,
      payload: attachments,
    });
  };
}

export function addFiles(files) {
  console.log('files', files);
  return (dispatch) => {
    dispatch({
      type: ADD_FILES,
      payload: files,
    });
  };
}

export function clearStates() {
  return (dispatch) => {
    dispatch({
      type: CLEAR_STATE,
    });
  };
}
