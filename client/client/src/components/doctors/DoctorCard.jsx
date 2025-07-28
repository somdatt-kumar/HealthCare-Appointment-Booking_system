import { Link } from 'react-router-dom';
import './doctors.css';

const DoctorCard = ({ doctor }) => {
  return (
    <div className="doctor-card">
      <div className="doctor-image">
        <img
          src={doctor.avatar || '/images/default-doctor.png'}
          alt={doctor.name}
        />
      </div>
      <div className="doctor-info">
        <h3>Dr. {doctor.name}</h3>
        <p className="specialty">{doctor.specialty}</p>
        <div className="doctor-meta">
          <span>
            <i className="fas fa-star"></i> {doctor.rating || '4.8'}
          </span>
          <span>
            <i className="fas fa-briefcase-medical"></i> {doctor.experience || '5'} years
          </span>
        </div>
        <p className="bio">{doctor.bio.substring(0, 100)}...</p>
        <Link to={`/doctors/${doctor._id}`} className="btn btn-primary">
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;