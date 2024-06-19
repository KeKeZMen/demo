import IUser from "./IUser";

export default interface IAuthResponse {
  token: string;
  user: IUser;
}
