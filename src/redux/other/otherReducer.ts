import {CreatorReducer} from '../base/base';
import {IOtherActions, IOtherState, Settings} from './otherTypes';
import {RootState} from '../reducer';
import service from '../../services/service';
import {actionsCart} from '../cart/cartReducer';
import {DEFAULT_NAME_SETTING} from '../../constants/constantsId';
import {actionsOrder} from '../order/orderReducer';

const init: IOtherState = {
  searchQueries: [],
  locale: null,
  settings: null,
  isSystemError: false,
  isPaymentError: false,
  deliveryPrices: [],
  maskCard: '',
  content: [],
  connectKey: '',
  draftId: null,
};
const MAX = 5;

const creator = new CreatorReducer<IOtherActions, IOtherState>('other');
creator.addAction('addSearchQueries', (state, action) => {
  const searchQueries = state.searchQueries.filter((s) => s !== action.payload);
  if (searchQueries.length >= MAX) {
    //searchQueries.pop();
  }
  searchQueries.unshift(action.payload);
  state.searchQueries = [...searchQueries];
  return {...state};
});
creator.addAction('removeSearchQueries', (state, action) => {
  const searchQueries = state.searchQueries.filter((s) => s !== action.payload);
  state.searchQueries = [...searchQueries];
  return {...state};
});
creator.addAction('setLocale', (state, action) => {
  return {...state, locale: action.payload};
});
creator.addAction('setSettings', (state, action) => {
  return {...state, settings: action.payload};
});
creator.addAction('setSystemError', (state, action) => {
  return {...state, isSystemError: action.payload};
});
creator.addAction('setDeliveryPrices', (state, action) => {
  return {...state, deliveryPrices: action.payload};
});
creator.addAction('setData', (state, action) => {
  return {...state, ...action.payload};
});
const actionsOther = creator.createActions();

const selectorsOther = {
  getSearchQueries: (state: RootState) => state.other.searchQueries,
  getLocale: (state: RootState) => state.other.locale,
  isSettings: (state: RootState) => state.other.settings === null,
  getSetting: (id: string | number) => (state: RootState) => {
    if (!state.other.settings) {
      return {
        step: 30,
        offset: 60,
        from: '12:00',
        to: '21:00',
      };
    }
    const setting = state.other.settings![id];
    if (id === DEFAULT_NAME_SETTING) {
      return {
        step: setting.order_time_step ? +setting.order_time_step : 30,
        offset: setting.order_offset_time ? +setting.order_offset_time : 60,
        from: setting.order_time_from ? setting.order_time_from : '12:00',
        to: setting.order_time_to ? setting.order_time_to : '21:00',
      };
    }
    const sellPoint: any =
      state.sellPoints.data.find((s) => s.id === +id) || {};
    const [from, to] = sellPoint.workTime
      ? sellPoint.workTime.split('-')
      : ['10:00', '23:00'];

    return {
      step: setting.order_time_step ? +setting.order_time_step : 30,
      offset: setting.order_offset_time ? +setting.order_offset_time : 60,
      from,
      to,
    };
  },
  getIdSellPoint: (state: RootState) => {
    if (!state.other.settings) return -1;
    return +state.other.settings![DEFAULT_NAME_SETTING]
      .default_price_sell_point!;
  },
  getIdDeliveryPrice: (state: RootState) => {
    if (!state.other.settings) return -1;
    return +state.other.settings![DEFAULT_NAME_SETTING].default_delivery_price!;
  },
  getPhone: (state: RootState) => {
    if (!state.other.settings) return '';
    return state.other.settings![DEFAULT_NAME_SETTING].delivery_phone!;
  },
  getDeliveryPrice: (id: number) => (state: RootState) => {
    const findItem = state.other.deliveryPrices.find((d) => d.id === id);
    return findItem ? +findItem.price : 0;
  },
  getIsSystemError: (state: RootState) => {
    return state.other.isSystemError;
  },
  getIsPaymentError: (state: RootState) => {
    return state.other.isPaymentError;
  },
  getMaskCard: (state: RootState) => {
    return state.other.maskCard;
  },
  getContent: (state: RootState) => {
    return state.other.content;
  },
  getConnectKey: (state: RootState) => {
    return state.other.connectKey;
  },
  getDraftId: (state: RootState) => {
    return state.other.draftId;
  },
};

const fetchGetAllSettings = async (dispatch: any) => {
  try {
    const res = (await service.getAllSetups()) || [];
    const setting = (await service.getSettings()) || [];

    let data: Settings = {
      [DEFAULT_NAME_SETTING]: {},
    };
    setting.forEach((s) => {
      data[DEFAULT_NAME_SETTING][s.code] = s.defaultValue;
    });
    res
      .filter((s) => s.sellPoint)
      .forEach((setting) => {
        const value = setting.value || setting.setting.defaultValue;
        const code = setting.setting.code;
        const key = setting.sellPoint!.id;

        if (!data[key]) {
          data[key] = {};
        }
        data[key][code] = value;
      });
    dispatch(
      actionsCart.updateCart(
        +data[DEFAULT_NAME_SETTING].default_price_sell_point!,
      ),
    );
    dispatch(
      actionsOrder.setData({
        idDeliveryPrice: +data[DEFAULT_NAME_SETTING].default_delivery_price!,
      }),
    );
    dispatch(actionsOther.setSettings(data));
  } catch (e) {}
};

const thunkGetAllSettings = ({store}: any) => {
  return store.dispatch(fetchGetAllSettings);
};

const thunkGetDeliveryPrices = async (dispatch: any) => {
  const res = await service.getDeliveryPrices();
  if (res.success) {
    dispatch(actionsOther.setDeliveryPrices(res.data));
  }
};

export {
  actionsOther,
  selectorsOther,
  fetchGetAllSettings,
  thunkGetDeliveryPrices,
  thunkGetAllSettings,
};
export default creator.createReducer(init);
