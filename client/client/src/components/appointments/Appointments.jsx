import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointments } from '../../redux/actions/appointment';
import Spinner from '../layout/Spinner';
import './appointments.css';

const Appointments = () => {
  const dispatch = useDispatch();
  const { appointments, loading } = useSelector((state) => state.appointment);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAppointments());
  }, [dispatch]);

  if (loading) return <Spinner />;

  return (
    <div className="appointments-container">
      <h1>My Appointments</h1>
      {appointments.length === 0 ? (
        <p className="no-appointments">You have no appointments scheduled</p>
      ) : (
        <div className="appointments-list">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-header">
                <h3>Dr. {appointment.doctor.name}</h3>
                <span className={`status-badge ${appointment.status}`}>
                  {appointment.status}
                </span>
              </div>
              <div className="appointment-body">
                <p className="appointment-date">
                  <i className="fas fa-calendar-alt"></i>{' '}
                  {new Date(appointment.date).toLocaleDateString()}
                </p>
                <p className="appointment-time">
                  <i className="fas fa-clock"></i>{' '}
                  {new Date(appointment.date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="appointment-reason">
                  <i className="fas fa-comment-medical"></i> {appointment.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;