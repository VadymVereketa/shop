import {CreatorReducer} from '../base/base';
import {IUserActions, IUserState} from './userTypes';
import service from '../../services/service';
import {RootState} from '../reducer';
import {IAddress, ICard, ISignUp, IUser} from '../../typings/FetchData';
import instance from '../../services/instance';

const init: IUserState = {
  data: null,
  error: false,
  isLoading: false,
  token: null,
  isAuth: false,
};

const creator = new CreatorReducer<IUserActions, IUserState>('user');
creator.addAction('logout', (state, action) => {
  return {...state, token: null, isAuth: false};
});
creator.addAction<IUser>('updateUser', (state, action) => {
  const user = {...state.data, ...action.payload};
  return {...state, data: user};
});
creator.addAction('addAddress', (state, action) => {
  const user = {...state.data!};
  user.addresses = [...user.addresses, action.payload];
  return {...state, data: user};
});
creator.addAction<IAddress>('updateAddress', (state, action) => {
  const index = state.data!.addresses.findIndex(
    (a) => a.id === action.payload.id,
  );
  if (index === -1) return state;
  const user = {...state.data!};
  user.addresses[index] = action.payload;
  user.addresses = [...user.addresses];
  return {...state, data: user};
});
creator.addAction('deleteAddress', (state, action) => {
  if (action.payload) {
    let addresses = state.data!.addresses;
    addresses = addresses.filter((a) => a.id !== action.payload);
    state.data!.addresses = addresses;
    return {...state};
  }
  return state;
});
creator.addAction('addContact', (state, action) => {
  const user = {...state.data!};
  user.contacts = [...user.contacts, action.payload];
  return {...state, data: user};
});
creator.addAction('updateContact', (state, action) => {
  const index = state.data!.contacts.findIndex(
    (a) => a.id === action.payload.id,
  );
  if (index === -1) return state;
  const user = {...state.data!};
  user.contacts[index] = action.payload;
  return {...state, data: user};
});
creator.addAction('deleteContact', (state, action) => {
  if (action.payload) {
    let contacts = state.data!.contacts;
    contacts = contacts.filter((a) => a.id !== action.payload);
    state.data!.contacts = contacts;
    return {...state};
  }
  return state;
});
creator.addAction('deleteCard', (state, action) => {
  if (action.payload) {
    let creditCards = state.data!.creditCards;
    creditCards = creditCards.filter((a) => a.id !== action.payload);
    state.data!.creditCards = creditCards;
    return {...state};
  }
  return state;
});
creator.addAction<ICard[]>('setCards', (state, action) => {
  if (action.payload) {
    state.data!.creditCards = action.payload;
    return {...state};
  }
  return state;
});
creator.addAction('setToken', (state, action) => {
  return {...state, token: action.payload};
});
creator.addAction('setAuth', (state, action) => {
  return {...state, isAuth: action.payload};
});
const actionsUser = creator.createActions();

const fetchLogin = (phone: string, password: string) => async (
  dispatch: any,
) => {
  return fetchRedux(
    async () => await service.login(phone, password),
    (data: any) => {
      const token = data.token;
      delete data.token;
      dispatch(actionsUser.setToken(token));
      dispatch(actionsUser.setData(data));
      dispatch(actionsUser.setAuth(true));
    },
  )(dispatch);
};
const fetchSignup = (data: ISignUp) => async (dispatch: any) => {
  return fetchRedux(
    async () => await service.signup(data),
    //(data: any) => dispatch(actionsUser.setData(data))
    (data: any) => null,
  )(dispatch);
};
const fetchLogout = async (dispatch: any) => {
  const res = await service.logout();
  if (res) {
    dispatch(actionsUser.logout());
  }
};

const fetchRedux = (fetch: any, saveData: any) => async (dispatch: any) => {
  dispatch(actionsUser.setLoading(true));
  const res = await fetch();

  if (res.success) {
    saveData(res.data);
  } else {
    dispatch(actionsUser.setError(res.data));
  }

  dispatch(actionsUser.setLoading(false));
  return res;
};

const refreshUser = async (dispatch: any) => {
  const res = await service.refreshUser();
  if (res) {
    dispatch(actionsUser.setData(res));
    dispatch(actionsUser.setAuth(true));
  } else {
    dispatch(actionsUser.logout());
  }
};

const selectorsUser = {
  getUser: (state: RootState) => state.user.data,
  getError: (state: RootState) => state.user.error,
  getLoading: (state: RootState) => state.user.isLoading,
  isAuth: (state: RootState) => state.user.isAuth,
  getAddressById: (id?: number | null) => (state: RootState) => {
    if (state.user.data)
      return state.user.data!.addresses.find((a) => a.id === id);
    return null;
  },
  getAddresses: (state: RootState) => {
    if (state.user.data === null) return [];
    return state.user.data.addresses || [];
  },
  getContacts: (state: RootState) => {
    if (state.user.data === null) return [];
    return state.user.data.contacts || [];
  },
  isEmptyContacts: (state: RootState) => {
    const contacts = selectorsUser.getContacts(state);
    return contacts.length === 0;
  },
  getDataUser: (state: RootState) => {
    if (state.user.data === null) return null;
    const user = state.user.data!;
    return {
      id: 1,
      name: `${user.firstName} ${user.lastName}`,
      phone: state.user.data.phone,
      isPhoneCustom: state.user.data.isPhoneCustom,
    };
  },
  getCards: (state: RootState) => {
    if (state.user.data) {
      return state.user.data.creditCards;
    }
    return [];
  },
  getCard: (id: number) => (state: RootState) => {
    const cards = selectorsUser.getCards(state);
    return cards.find((c) => c.id === id);
  },
};

export {
  actionsUser,
  selectorsUser,
  fetchLogin,
  fetchSignup,
  fetchLogout,
  refreshUser,
};
export default creator.createReducerFetch(init);
