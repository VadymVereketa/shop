import {CreatorReducer} from '../base/base';
import {IBaseActions} from '../base/baseTypes';
import {
  IDeliveryPrice,
  IDeliveryType,
  IPaymentType,
  IRootCategory,
  ITag,
} from '../../typings/FetchData';
import {ITypeState} from './typeTypes';
import {RootState} from '../reducer';
import service from '../../services/service';
import {TypePayment} from '../../constants/constantsId';

interface ICategoryActions extends IBaseActions {
  setDelivery: (tags: IDeliveryType[]) => any;
  setPayment: (tags: IPaymentType[]) => any;
  setPrices: (tags: IDeliveryPrice[]) => any;
}

const init: ITypeState = {
  deliveryTypes: [],
  paymentTypes: [],
  pricesTypes: [],
  error: null,
  isLoading: false,
};

const creator = new CreatorReducer<ICategoryActions, ITypeState>('types');
creator.addAction('setDelivery', (state, action) => {
  return {...state, deliveryTypes: action.payload};
});
creator.addAction('setPayment', (state, action) => {
  return {...state, paymentTypes: action.payload};
});
creator.addAction('setPrices', (state, action) => {
  return {...state, pricesTypes: action.payload};
});
const actionsTypes = creator.createActions();

const thunkGetTypes = async (dispatch: any) => {
  dispatch(actionsTypes.setLoading(false));
  try {
    let res = await service.getDeliveryTypes();
    if (res.success) {
      dispatch(actionsTypes.setDelivery(res.data));
    }
    res = await service.getPaymentsTypes();
    if (res.success) {
      const item = {
        id: res.data.find((d) => d.code === TypePayment.credit).id,
        code: TypePayment.online,
      };
      dispatch(actionsTypes.setPayment([...res.data, item]));
    }
    res = await service.getDeliveryPrices();
    if (res.success) {
      dispatch(actionsTypes.setPrices(res.data));
    }
  } catch (e) {
    dispatch(actionsTypes.setError(e));
  } finally {
    dispatch(actionsTypes.setLoading(false));
  }
};

const selectorsTypes = {
  getDeliveryTypes: (state: RootState) => {
    return state.types.deliveryTypes;
  },
  getPaymentsTypes: (state: RootState) => {
    return state.types.paymentTypes;
  },
  getPricesTypes: (state: RootState) => {
    return state.types.pricesTypes;
  },
  getDeliveryPrice: (id: number) => (state: RootState) => {
    const findItem = state.types.pricesTypes.find((d) => d.id === id);
    return findItem ? +findItem.price : 0;
  },
};

export {actionsTypes, selectorsTypes, thunkGetTypes};
export default creator.createReducer(init);
