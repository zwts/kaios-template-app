import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../constants';

const cachedAppVersion = localStorage.getItem(STORAGE_KEYS.APP_VERSION);
const appSlice = createSlice({
  name: 'app',
  initialState: {
    version: cachedAppVersion ? cachedAppVersion : '0.0.1',
  },
  reducers: {
    setAppVersion: (state, action) => {
      state.version = action.payload;
      localStorage.setItem(STORAGE_KEYS.APP_VERSION, action.payload);
    },
  },
});

export const {
 setAppVersion
} = appSlice.actions;
export default appSlice.reducer;
