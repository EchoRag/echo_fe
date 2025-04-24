import { createSlice } from '@reduxjs/toolkit';
import { useAuthContext } from '../context/AuthContext';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: null,
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export const fetchUser = () => (dispatch: any) => {
  const { user } = useAuthContext();
  if (user) {
    dispatch(setUser({ user }));
  } else {
    dispatch(clearUser());
  }
};

export default userSlice.reducer;
