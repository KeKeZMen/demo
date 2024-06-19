import { Suspense, lazy, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import RequireAuth from "./hocs/requiredAuth";
import { useAppDispatch } from "./hooks/reduxHooks";
import { reauthUser } from "./store/thunks/authThunk";
import "./index.css";

const Loginpage = lazy(() => import("./pages/LoginPage"));
const Registerpage = lazy(() => import("./pages/RegisterPage"));

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) dispatch(reauthUser());
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <Suspense></Suspense>
          </RequireAuth>
        }
      />

      <Route element={<Loginpage />} path="/login" />

      <Route element={<Registerpage />} path="/register" />
    </Routes>
  );
}

export default App;
