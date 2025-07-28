import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createAppointment } from '../../redux/actions/appointment';
import Spinner from '../layout/Spinner';
import './appointments.css';

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    reason: '',
  });
  const { date, reason } = formData;
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.appointment);
  const { doctor } = useSelector((state) => state.doctor);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createAppointment(id, { date, reason }, navigate));
  };

  if (loading) return <Spinner />;

  return (
    <div className="booking-form-container">
      <h2>
        Book Appointment with Dr. {doctor?.name} ({doctor?.specialty})
      </h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Date and Time</label>
          <input
            type="datetime-local"
            name="date"
            value={date}
            onChange={onChange}
            min={new Date().toISOString().slice(0, 16)}
            required
          />
        </div>
        <div className="form-group">
          <label>Reason for Visit</label>
          <textarea
            name="reason"
            value={reason}
            onChange={onChange}
            rows="4"
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Confirm Booking
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;