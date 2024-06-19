import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

import $api from "../../http/axiosApi";
import IAuthResponse from "../../models/IAuthResponse";

export type RegisterType = {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  departament: string;
};

export type LoginType = {
  email: string;
  password: string;
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }: LoginType, thunkApi) => {
    try {
      const result = await $api.post<IAuthResponse>("/login", {
        email,
        password,
      });
      localStorage.setItem("token", result.data.token);
      return result.data.user;
    } catch (axiosError) {
      const error = axiosError as AxiosError;
      return thunkApi.rejectWithValue(error.response?.data);
    }
  }
);

export const reauthUser = createAsyncThunk(
  "auth/refresh",
  async (_, thunkApi) => {
    try {
      const result = await axios.get<IAuthResponse>(
        `http://localhost:3000/refresh`,
        { withCredentials: true }
      );
      localStorage.setItem("token", result.data.token);
      return result.data.user;
    } catch (axiosError) {
      const error = axiosError as AxiosError;
      return thunkApi.rejectWithValue(error.response?.data);
    }
  }
);

export const registrationUser = createAsyncThunk(
  "auth/registration",
  async (
    { departament, email, phoneNumber, password, name }: RegisterType,
    thunkApi
  ) => {
    try {
      const result = await $api.post<IAuthResponse>("/register", {
        departament,
        email,
        phoneNumber,
        password,
        name
      });
      localStorage.setItem("token", result.data.token);
      return result.data.user;
    } catch (axiosError) {
      const error = axiosError as AxiosError;
      return thunkApi.rejectWithValue(error.response?.data);
    }
  }
);
