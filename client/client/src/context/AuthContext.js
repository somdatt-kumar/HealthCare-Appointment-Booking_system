import { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'LOAD_USER':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token'),
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.token) {
        axios.defaults.headers.common['x-auth-token'] = localStorage.token;
        try {
          const res = await axios.get('/api/auth');
          dispatch({ type: 'LOAD_USER', payload: res.data });
        } catch (err) {
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        }
      }
    };
    loadUser();
  }, []);

  const login = async (formData) => {
    const res = await axios.post('/api/auth', formData);
    dispatch({
      type: 'LOGIN',
      payload: { user: res.data.user, token: res.data.token },
    });
    localStorage.setItem('token', res.data.token);
    navigate('/dashboard');
  };

  const register = async (formData) => {
    const res = await axios.post('/api/users', formData);
    dispatch({
      type: 'LOGIN',
      payload: { user: res.data.user, token: res.data.token },
    });
    localStorage.setItem('token', res.data.token);
    navigate('/dashboard');
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};