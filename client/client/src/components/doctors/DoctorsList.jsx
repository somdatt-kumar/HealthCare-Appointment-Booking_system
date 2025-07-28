import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctors } from '../../redux/actions/doctor';
import DoctorCard from './DoctorCard';
import Spinner from '../layout/Spinner';
import './doctors.css';

const DoctorsList = () => {
  const dispatch = useDispatch();
  const { doctors, loading } = useSelector((state) => state.doctor);

  useEffect(() => {
    dispatch(getDoctors());
  }, [dispatch]);

  if (loading) return <Spinner />;

  return (
    <div className="doctors-container">
      <div className="doctors-header">
        <h1>Our Doctors</h1>
        <p>Choose from our list of qualified specialists</p>
      </div>
      <div className="doctors-grid">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor._id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;