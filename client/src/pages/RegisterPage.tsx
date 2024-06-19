import { useForm, SubmitHandler } from "react-hook-form";
import { FC, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { registrationUser, RegisterType } from "../store/thunks/authThunk";

const Registerpage: FC = () => {
  const { isAuth, errorData, isError, isLoading } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();

  const { register, handleSubmit } = useForm<RegisterType>();
  const onSubmit: SubmitHandler<RegisterType> = (data) =>
    dispatch(
      registrationUser({
        name: data.name,
        password: data.password,
        email: data.email,
        departament: data.departament,
        phoneNumber: data.phoneNumber,
      })
    );

  const navigate = useNavigate();
  useEffect(() => {
    if (isAuth) navigate("/");
  }, [isAuth]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input required type="text" {...register("name")} />
        <input required type="email" {...register("email")} />
        <input required type="text" {...register("departament")} />
        <input required type="text" {...register("phoneNumber")} />
        <input required type="password" {...register("password")} />
        <button type="submit">
          {isLoading ? <>Загрузка...</> : <>Зарегистрироваться</>}
        </button>
        <Link to="/login">Есть аккаунт? Войти</Link>
      </form>

      {isError && <p>{errorData?.message}</p>}
    </div>
  );
};

export default Registerpage;
