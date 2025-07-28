import axios from 'axios';
import {
  GET_APPOINTMENTS,
  GET_APPOINTMENT,
  ADD_APPOINTMENT,
  UPDATE_APPOINTMENT,
  DELETE_APPOINTMENT,
  APPOINTMENT_ERROR,
} from '../types';
import { setAlert } from './alert';

// Get all appointments
export const getAppointments = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/appointments');

    dispatch({
      type: GET_APPOINTMENTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: APPOINTMENT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get appointment by ID
export const getAppointmentById = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/appointments/${id}`);

    dispatch({
      type: GET_APPOINTMENT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: APPOINTMENT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add appointment
export const createAppointment = (doctorId, formData, navigate) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post(`/api/appointments/${doctorId}`, formData, config);

    dispatch({
      type: ADD_APPOINTMENT,
      payload: res.data,
    });

    dispatch(setAlert('Appointment booked successfully', 'success'));
    navigate('/appointments');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: APPOINTMENT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Update appointment
export const updateAppointment = (id, formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.put(`/api/appointments/${id}`, formData, config);

    dispatch({
      type: UPDATE_APPOINTMENT,
      payload: res.data,
    });

    dispatch(setAlert('Appointment updated successfully', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: APPOINTMENT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete appointment
export const deleteAppointment = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/appointments/${id}`);

    dispatch({
      type: DELETE_APPOINTMENT,
      payload: id,
    });

    dispatch(setAlert('Appointment removed successfully', 'success'));
  } catch (err) {
    dispatch({
      type: APPOINTMENT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};