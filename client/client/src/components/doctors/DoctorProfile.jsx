import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorById } from '../../redux/actions/doctor';
import Spinner from '../layout/Spinner';
import BookingForm from '../appointments/BookingForm';
import './doctors.css';

const DoctorProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { doctor, loading } = useSelector((state) => state.doctor);

  useEffect(() => {
    dispatch(getDoctorById(id));
  }, [dispatch, id]);

  if (loading || !doctor) return <Spinner />;

  return (
    <div className="doctor-profile-container">
      <div className="doctor-profile-header">
        <div className="doctor-avatar">
          <img
            src={doctor.avatar || '/images/default-doctor.png'}
            alt={doctor.name}
          />
        </div>
        <div className="doctor-info">
          <h1>Dr. {doctor.name}</h1>
          <p className="specialty">{doctor.specialty}</p>
          <div className="doctor-meta">
            <span>
              <i className="fas fa-star"></i> {doctor.rating || '4.8'} Rating
            </span>
            <span>
              <i className="fas fa-briefcase-medical"></i> {doctor.experience || '5'} Years Experience
            </span>
            <span>
              <i className="fas fa-map-marker-alt"></i> {doctor.location || 'Main Hospital'}
            </span>
          </div>
          <Link to={`/doctors/${doctor._id}/book`} className="btn btn-primary">
            Book Appointment
          </Link>
        </div>
      </div>

      <div className="doctor-details">
        <div className="doctor-about">
          <h2>About Dr. {doctor.name}</h2>
          <p>{doctor.bio}</p>

          <h3>Education</h3>
          <ul className="education-list">
            {doctor.education?.map((edu, index) => (
              <li key={index}>
                <strong>{edu.degree}</strong> - {edu.institution} ({edu.year})
              </li>
            ))}
          </ul>

          <h3>Specializations</h3>
          <div className="specializations">
            {doctor.specializations?.map((spec, index) => (
              <span key={index} className="specialization-badge">
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div className="doctor-availability">
          <h2>Availability</h2>
          <div className="availability-schedule">
            {doctor.availability?.map((day, index) => (
              <div key={index} className="availability-day">
                <h4>{day.day}</h4>
                <p>
                  {day.startTime} - {day.endTime}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;