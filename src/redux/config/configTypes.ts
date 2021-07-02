export interface IConfigActions {
  setData: (o: Partial<IConfigState>) => any;
}

export interface IConfigState {
  enabledOptionalCheckVersion: boolean;
  enabledRequiredCheckVersion: boolean;
  optionalVersionAndroid: number;
  requiredVersionAndroid: number;
  optionalVersionIOS: string;
  requiredVersionIOS: string;

  isNewCategory: boolean;
}

export type ItemConfigState = keyof IConfigState;
