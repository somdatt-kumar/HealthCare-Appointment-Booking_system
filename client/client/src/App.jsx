import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './components/pages/Home';
import Dashboard from './components/pages/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import DoctorsList from './components/doctors/DoctorsList';
import DoctorProfile from './components/doctors/DoctorProfile';
import Appointments from './components/appointments/Appointments';
import NotFound from './components/pages/NotFound';
import PrivateRoute from './components/routing/PrivateRoute';
import { loadUser } from './redux/actions/auth';
import './App.css';

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/doctors" element={<DoctorsList />} />
              <Route path="/doctors/:id" element={<DoctorProfile />} />
              <Route
                path="/appointments"
                element={<PrivateRoute component={Appointments} />}
              />
              <Route
                path="/dashboard"
                element={<PrivateRoute component={Dashboard} />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <ToastContainer position="top-right" autoClose={5000} />
          <Footer />
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;



