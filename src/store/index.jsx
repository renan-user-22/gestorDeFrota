import { configureStore } from '@reduxjs/toolkit';
import companyReducer from './slices/companySlice';
import usersReducer from './slices/usersSlice';
import permissionsReducer from './slices/permissionsSlice';
import flowReducer from './slices/flowSlice';

export const store = configureStore({
  reducer: {
    company: companyReducer,
    users: usersReducer,
    permissions: permissionsReducer,
    flow: flowReducer,
  },
});

export default store;
