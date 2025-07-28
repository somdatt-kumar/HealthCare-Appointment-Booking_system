import { Link } from 'react-router-dom';
import './pages.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="container">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you are looking for doesn't exist or has been moved.</p>
          <Link to="/" className="btn btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;