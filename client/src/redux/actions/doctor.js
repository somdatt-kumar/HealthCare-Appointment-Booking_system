import axios from 'axios';
import {
  GET_DOCTORS,
  GET_DOCTOR,
  DOCTOR_ERROR,
  CLEAR_DOCTOR
} from '../types';

// Get all doctors
export const getDoctors = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/doctors');
    dispatch({
      type: GET_DOCTORS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: DOCTOR_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get doctor by ID
export const getDoctorById = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/doctors/${id}`);
    dispatch({
      type: GET_DOCTOR,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: DOCTOR_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Clear doctor
export const clearDoctor = () => (dispatch) => {
  dispatch({ type: CLEAR_DOCTOR });
};