import {CreatorReducer} from '../base/base';
import {ICartActions, ICartState} from './cartTypes';
import {RootState} from '../reducer';
import {ICartItem} from '../../typings/FetchData';
import service from '../../services/service';
import {actionsUser} from '../user/userReducer';
import {ID_UNIT_WEIGHT} from '../../constants/constantsId';

const init: ICartState = {
  data: [],
  isLoading: false,
  error: null,
  isOpenCart: false,
  idSellPoint: -1,
};

const creator = new CreatorReducer<ICartActions, ICartState>('cart');
creator.addAction('addProduct', (state, action) => {
  const data = [...state.data, action.payload];
  return {...state, data};
});
creator.addAction('removeProduct', (state, action) => {
  const data = state.data.filter(
    (item) => +item.product.id !== +action.payload,
  );
  return {...state, data};
});
creator.addAction('incrProduct', (state, action) => {
  const {id, count} = action.payload;
  let index = state.data.findIndex((item) => item.product.id == id)!;
  let res = state.data[index].count;
  res = res + count;
  state.data[index] = {...state.data[index], count: res};

  return {...state, data: [...state.data]};
});
creator.addAction('decrProduct', (state, action) => {
  const {id, count} = action.payload;
  let index = state.data.findIndex((item) => item.product.id == id)!;
  let res = state.data[index].count;
  res = res - count;
  if (res < 0.1) {
    return state;
  }
  state.data[index] = {...state.data[index], count: res};
  return {...state, data: [...state.data]};
});
creator.addAction('changeCount', (state, action) => {
  const {id, count} = action.payload;
  let index = state.data.findIndex((item) => item.product.id == id)!;
  if (index === -1) return state;
  state.data[index] = {...state.data[index], count};
  return {...state, data: [...state.data]};
});
creator.addAction('changeAlternativeCount', (state, action) => {
  const {id, count} = action.payload;
  let index = state.data.findIndex((item) => item.product.id == id)!;
  if (index === -1) return state;
  state.data[index] = {...state.data[index], alternativeCount: count};
  return {...state, data: [...state.data]};
});
creator.addAction('toggleCart', (state, action) => {
  return {...state, isOpenCart: action.payload};
});
creator.addAction('setComment', (state, action) => {
  const {id, comment} = action.payload;
  const index = state.data.findIndex((item) => item.product.id == id)!;
  if (index === -1) return state;
  state.data[index] = {...state.data[index], comment};
  return {...state, data: [...state.data]};
});
creator.addAction<number>('updateCart', (state, action) => {
  return {...state, idSellPoint: action.payload};
});
creator.addAction('clear', (state, action) => ({
  ...init,
  data: [],
  idSellPoint: action.payload,
}));
creator.addAction(actionsUser.logout, (state) => ({...init, data: []}));

const actionsCart = creator.createActions();
const selectorsCart = {
  getCartProducts: (state: RootState) => state.cart.data,
  getCartProduct: (id: number) => (state: RootState) => {
    const items = selectorsCart.getCartProducts(state);
    return items.find((item) => item.product.id === id);
  },
  isEmpty: (state: RootState) => state.cart.data.length === 0,
  getGeneralSum: (state: RootState) => {
    const data = selectorsCart.getCartProducts(state);

    return data.reduce((previousValue, current) => {
      let index = current.product.productOptions.findIndex(
        (p) => p.sellPoint.id === state.cart.idSellPoint,
      );
      index = index === -1 ? 0 : index;
      const count =
        current.alternativeCount !== null
          ? current.alternativeCount * +current.product.avgWeight!
          : current.count;
      return (
        previousValue + +current.product.productOptions[index].price * count
      );
    }, 0);
  },
  getGeneralCount: (state: RootState) => {
    const data = selectorsCart.getCartProducts(state);
    return data.length;
  },
  getCountProduct: (id: number) => (state: RootState) => {
    const product = selectorsCart.getCartProduct(id)(state);
    if (product) {
      if (product.alternativeCount) return product.alternativeCount;
      return product.count;
    }
    return null;
  },
  getAlternativeCountProduct: (id: number) => (state: RootState) => {
    const product = selectorsCart.getCartProduct(id)(state);
    if (product) {
      return product.alternativeCount ? product.alternativeCount : null;
    }
    return null;
  },
  getIsOpenCart: (state: RootState) => {
    return state.cart.isOpenCart;
  },
  checkProductInCart: (id: string | number) => (state: RootState) => {
    const data = selectorsCart.getCartProducts(state);
    return data.find((item) => item.product.id + '' === id + '') !== undefined;
  },
  getIdSellPoint: (state: RootState) => state.cart.idSellPoint,
  getIsLoading: (state: RootState) => state.cart.isLoading,
  getIsWeightProducts: (state: RootState) => {
    if (state.cart.data.length === 0) return false;

    return state.cart.data.some((p) => p.product.units === ID_UNIT_WEIGHT);
  },
};

const fetchUpdateCart = (products: ICartItem[], id: number) => async (
  dispatch: any,
) => {
  try {
    dispatch(actionsCart.setLoading(true));
    const res = await service.saveCart(products, id);
    if (res.success) {
      dispatch(actionsCart.updateCart(res.data.sellPoint.id));
    } else {
      dispatch(actionsCart.setError(res.data));
    }
    dispatch(actionsCart.setLoading(false));
    return res.success;
  } catch (e) {
    return false;
  }
};

export {actionsCart, selectorsCart, fetchUpdateCart};
export default creator.createReducerFetch(init);
