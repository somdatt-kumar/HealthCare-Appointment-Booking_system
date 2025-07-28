import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointments } from '../../redux/actions/appointment';
import Spinner from '../layout/Spinner';
import './pages.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { appointments, loading } = useSelector((state) => state.appointment);

  useEffect(() => {
    dispatch(getAppointments());
  }, [dispatch]);

  if (loading) return <Spinner />;

  return (
    <div className="dashboard-container">
      <div className="container">
        <h1>Welcome, {user?.name}</h1>
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Upcoming Appointments</h3>
            {appointments.length === 0 ? (
              <p>You have no upcoming appointments</p>
            ) : (
              <ul className="appointments-list">
                {appointments.slice(0, 3).map((appointment) => (
                  <li key={appointment._id}>
                    <div className="appointment-info">
                      <h4>Dr. {appointment.doctor.name}</h4>
                      <p>
                        {new Date(appointment.date).toLocaleDateString()} at{' '}
                        {new Date(appointment.date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span className={`status ${appointment.status}`}>
                      {appointment.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/appointments" className="btn btn-link">
              View All Appointments
            </Link>
          </div>
          <div className="dashboard-card">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <Link to="/doctors" className="btn btn-primary">
                Book Appointment
              </Link>
              <Link to="/profile" className="btn btn-outline">
                Update Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;