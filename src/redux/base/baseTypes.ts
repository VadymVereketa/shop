export interface IBaseState<T = any | null> {
  data: T;
  isLoading: boolean;
  error: any;
}

export interface IBaseActions {
  setLoading: any;
  setData: any;
  setError: any;
}

export interface IAction<T = any> {
  payload: T;
  type: string;
}
