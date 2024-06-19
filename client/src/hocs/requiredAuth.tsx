import { Navigate } from "react-router-dom";

import { useAppSelector } from "../hooks/reduxHooks";

type PropsType = {
  children: JSX.Element;
};

const RequireAuth = ({ children }: PropsType) => {
  const { isAuth } = useAppSelector((state) => state.auth);
  
  if (!isAuth) return <Navigate to={'/login'} replace={true}/>;

  return children;
};

export default RequireAuth;
