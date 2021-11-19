import {CreatorReducer} from '../base/base';
import {RootState} from '../reducer';
import service from '../../services/service';
import {ICityActions, ICityState, ItemCityState} from './cityTypes';
import {ICityFetch, ICityRedux, ISettingCity} from '../../typings/ICity';

const init: ICityState = {
  data: [],
  isLoading: false,
  error: null,
  selectedCity: null,
};

const creator = new CreatorReducer<ICityActions, ICityState>('city');
creator.addAction('setDataItem', (state, action) => {
  return {...state, ...action.payload};
});

const actionsCity = creator.createActions();

class SelectorCity {
  static getItem = (name: ItemCityState) => (state: RootState) => {
    return state.city[name];
  };
  static getCities(state: RootState) {
    return state.city.data;
  }
  static getSelectedCityId(state: RootState) {
    return state.city.selectedCity;
  }
  static getSelectedCity(state: RootState) {
    if (state.city.selectedCity === null) {
      return null;
    }
    if (state.city.data.length === 0) {
      return null;
    }

    return state.city.data.find((c) => c.id === state.city.selectedCity)!;
  }
  static isKiev(state: RootState) {
    return state.city.selectedCity === 1;
  }
  static getNameSelectedCity(state: RootState) {
    const city = SelectorCity.getSelectedCity(state);
    return city ? city.name : '';
  }

  static getDefaultPriceSellPointId(state: RootState) {
    const city = SelectorCity.getSelectedCity(state);
    return city ? city.setups.default_price_sell_point : null;
  }

  static getDefaultDeliveryPrice(state: RootState) {
    const city = SelectorCity.getSelectedCity(state);

    if (!city) {
      return null;
    }

    return (
      city.deliveryPrices.find(
        (d) => d.id === city.setups.default_delivery_price,
      ) || null
    );
  }

  static getDeliveryPrices(state: RootState) {
    const city = SelectorCity.getSelectedCity(state);
    return city ? city.deliveryPrices : [];
  }

  static getDeliveryPriceById(id: number) {
    return (state: RootState) => {
      const city = SelectorCity.getSelectedCity(state);
      if (city === null) {
        return 0;
      }
      const deliveryItem = city.deliveryPrices.find((d) => d.id === id);
      return deliveryItem ? +deliveryItem.price : 0;
    };
  }

  //TODO: delete
  static getDeliveryPricesForLviv(state: RootState) {
    const city = SelectorCity.getSelectedCity(state);
    if (city === null) {
      return null;
    }
    if (city.id === 1) {
      return null;
    }

    return city.deliveryPrices.reduce((a, b) => {
      a[b.externalId] = b.id;
      return a;
    }, {}) as {main80: number; other150: number};
  }
}

const thunkGetAllCities = async (dispatch: any) => {
  dispatch(actionsCity.setLoading(true));

  const res = await service.getCities();
  if (res.success) {
    const cities: ICityFetch[] = res.data;

    const reduxCities: ICityRedux[] = cities.map((c) => {
      const setting: ISettingCity = {};
      c.setups.forEach((s) => {
        if (!s.isActive) {
          return;
        }

        try {
          const value = JSON.parse(s.value || s.setting.defaultValue);
          setting[s.setting.code] = value;
        } catch {
          setting[s.setting.code] = s.value || s.setting.defaultValue;
        }
      });

      return {...c, setups: setting};
    });

    dispatch(actionsCity.setData(reduxCities));
  }
  dispatch(actionsCity.setLoading(false));
};

export {actionsCity, SelectorCity, thunkGetAllCities};
export default creator.createReducerFetch(init);
