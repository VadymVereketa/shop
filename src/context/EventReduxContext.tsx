import React, {useCallback, useContext, useEffect} from 'react';
import {actionsCart, fetchSaveCart} from '../redux/cart/cartReducer';
import {RootState} from '../redux/reducer';
import {actionsOrder} from '../redux/order/orderReducer';
import {actionsCity} from '../redux/city/cityReducer';
import debounce from 'lodash.debounce';
import {useDispatch} from 'react-redux';

interface IEventReduxContext {}

const EventReduxContext = React.createContext({} as IEventReduxContext);

const useEventRedux = () => {
  const context = useContext(EventReduxContext);
  return context;
};

enum TypeEvent {
  addProduct = actionsCart.addProduct(null as any).type,
  removeProduct = actionsCart.removeProduct(null as any).type,
  changeAlternativeCount = actionsCart.changeAlternativeCount(null as any).type,
  changeCount = actionsCart.changeCount(null as any).type,
  incrProduct = actionsCart.incrProduct(null as any).type,
  decrProduct = actionsCart.decrProduct(null as any).type,
  setComment = actionsCart.setComment(null as any).type,
  clear = actionsCart.clear().type,
  actionsOrderSetData = actionsOrder.setData(null as any).type,
  actionsCitySetData = actionsCity.setDataItem(null as any).type,
}

const cartEvetns = [
  TypeEvent.addProduct,
  TypeEvent.removeProduct,
  TypeEvent.changeAlternativeCount,
  TypeEvent.changeCount,
  TypeEvent.incrProduct,
  TypeEvent.decrProduct,
  TypeEvent.setComment,
  TypeEvent.clear,
];
let event: any = {};

const eventCatch = (store) => (next) => (action) => {
  const state: RootState = store.getState();
  if (action.type === TypeEvent.removeProduct) {
    const payload = state.cart.data.find(
      (item) => item.product.id == action.payload,
    );
    event.action = {
      type: TypeEvent.removeProduct,
      payload,
    };
  } else {
    event.action = action;
  }
  return next(action);
};

const ProviderEventRedux = ({children}: any) => {
  const dispatch = useDispatch();

  const handleSaveCart = useCallback(
    debounce(() => {
      dispatch(fetchSaveCart);
    }, 1000),
    [],
  );

  useEffect(() => {
    event = new Proxy(event, {
      set(target, prop, val) {
        const {payload} = val;

        if (cartEvetns.some((type) => type === val.type)) {
          handleSaveCart();
        }
        return true;
      },
    });
  }, []);

  return (
    <EventReduxContext.Provider value={{}}>
      {children}
    </EventReduxContext.Provider>
  );
};

export {useEventRedux, eventCatch};
export default ProviderEventRedux;
