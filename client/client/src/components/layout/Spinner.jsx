import './layout.css';

const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p>Loading...</p>
    </div>
  );
};

export default Spinner;