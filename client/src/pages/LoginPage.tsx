import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { LoginType, loginUser } from "../store/thunks/authThunk";

const Loginpage = () => {
  const { isAuth, errorData, isError, isLoading } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();

  const { register, handleSubmit } = useForm<LoginType>();
  const onSubmit: SubmitHandler<LoginType> = (data) =>
    dispatch(loginUser({ email: data.email, password: data.password }));

  const navigate = useNavigate();
  useEffect(() => {
    if (isAuth) navigate("/");
  }, [isAuth]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h5>Войти</h5>
        <input required type="text" {...register("email")} />
        <input required type="password" {...register("password")} />
        <button type="submit">
          {isLoading ? <>Загрузка...</> : <>Войти</>}
        </button>
        <Link to="/register">Нет аккаунта? Зарегистрироваться</Link>
      </form>

      {isError && <p>{errorData?.message}</p>}
    </div>
  );
};

export default Loginpage;
