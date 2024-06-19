import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authSlice from "./slices/authSlice";

const RootReducer = combineReducers({
  auth: authSlice,
  // [tasksApi.reducerPath]: tasksApi.reducer
});

export const makeStore = () =>
  configureStore({
    reducer: RootReducer,
    // middleware: (getDefaultMiddleware) =>
    //   getDefaultMiddleware().concat(tasksApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
