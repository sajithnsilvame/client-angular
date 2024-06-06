export interface ApiResponse<T> {
    message: string;
    data: T;
}

export interface IStudent {
  _id: string;
  name: string;
  email: string;
  password: string;
}
