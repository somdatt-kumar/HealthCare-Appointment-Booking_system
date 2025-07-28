import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './reducers/auth';
import alertReducer from './reducers/alert';
import doctorReducer from './reducers/doctor';
import appointmentReducer from './reducers/appointment';

const rootReducer = combineReducers({
  auth: authReducer,
  alert: alertReducer,
  doctor: doctorReducer,
  appointment: appointmentReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);