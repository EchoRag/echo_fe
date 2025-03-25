import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import projectsReducer from './projectsSlice'; // Import projectsReducer

const store = configureStore({
  reducer: {
    user: userReducer,
    projects: projectsReducer, // Add projects reducer
  },
});

export default store;
