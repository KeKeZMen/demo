import { createSlice } from "@reduxjs/toolkit";

import {
  reauthUser,
  loginUser,
  logoutUser,
  registrationUser,
} from "../thunks/authThunk";
import IUser from "../../models/IUser";

type InitialStateType = {
  user: IUser;
  isLoading: boolean;
  isError: boolean;
  errorData: any;
  isAuth: boolean;
};

const initialState: InitialStateType = {
  user: {} as IUser,
  isLoading: false,
  isError: false,
  errorData: null,
  isAuth: false,
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    //loginUser()
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
    }),
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuth = true;
      state.user = action.payload;
    }),
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorData = action.payload;
    }),
    //reauthUser()
    builder.addCase(reauthUser.pending, (state) => {
      state.isLoading = true;
    }),
    builder.addCase(reauthUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuth = true;
      state.user = action.payload;
    }),
    builder.addCase(reauthUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorData = action.payload;
    }),
    //logout()
    builder.addCase(logoutUser.pending, (state) => {
      state.isLoading = true;
    }),
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isLoading = false;
      state.isAuth = false;
      state.user = {} as IUser;
    }),
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuth = false;
      state.isError = true;
      state.errorData = action.payload;
    });

    //registration()
    builder.addCase(registrationUser.pending, (state) => {
      state.isLoading = true;
    }),
    builder.addCase(registrationUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuth = false;
      state.user = action.payload;
    }),
    builder.addCase(registrationUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorData = action.payload;
    });
  },
});

export default userSlice.reducer;
export const {} = userSlice.actions;
