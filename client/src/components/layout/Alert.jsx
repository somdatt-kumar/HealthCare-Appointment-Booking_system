import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeAlert } from '../../redux/actions/alert';
import './layout.css';

const Alert = () => {
  const dispatch = useDispatch();
  const alerts = useSelector((state) => state.alert);

  useEffect(() => {
    if (alerts.length > 0) {
      const timer = setTimeout(() => {
        dispatch(removeAlert(alerts[0].id));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alerts, dispatch]);

  return (
    <div className="alert-container">
      {alerts.map((alert) => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
          {alert.msg}
          <button
            className="alert-close"
            onClick={() => dispatch(removeAlert(alert.id))}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default Alert;