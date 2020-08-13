import {CreatorReducer} from '../base/base';
import {IOrderActions, IOrderState, StatusPayment} from './orderTypes';
import {RootState} from '../reducer';
import {selectorsOther} from '../other/otherReducer';

const init: IOrderState = {
  address: null,
  deliveryType: null,
  paymentType: null,
  step: 1,
  contact: null,
  sellPoint: null,
  isCallBack: false,
  date: '',
  time: '',
  anonymousMessage: null,
  addressId: -1,
  commentAddress: '',
  numberOrder: null,
  idDeliveryPrice: -1,
  statusPayment: StatusPayment.defult,
};

const creator = new CreatorReducer<IOrderActions, IOrderState>('order');
creator.addAction('setData', (state, action) => {
  return {...state, ...action.payload};
});
creator.addAction('addContact', (state, action) => {
  return {...state, contact: action.payload};
});
creator.addAction('updateContact', (state, action) => {
  return {...state, contact: action.payload};
});
creator.addAction<number>('removeContact', (state, action) => {
  return {...state, contact: null};
});
creator.addAction('checkLast', (state) => {
  if (state.contact === null || state.contact.id === null) {
    return {...state, contact: null};
  }
  return state;
});
creator.addAction('clear', (state) => {
  return init;
});

const actionsOrder = creator.createActions();
const selectorsOrder = {
  getOrder: (state: RootState) => state.order,
  getStep: (state: RootState) => state.order.step,
  getAddress: (state: RootState) => state.order.address,
  isDeliveryCourier: (state: RootState) => {
    if (state.order.deliveryType === null) return false;
    return state.order.deliveryType!.code === 'courier';
  },
  isDeliverySelf: (state: RootState) => {
    if (state.order.deliveryType === null) return false;
    return state.order.deliveryType!.code === 'self';
  },
  getCodePayment: (state: RootState) =>
    state.order.paymentType ? state.order.paymentType.code : '',
  getSellPoint: (state: RootState) => state.order.sellPoint,
  getIdDeliveryPrice: (state: RootState) => {
    return selectorsOther.getDeliveryPrice(state.order.idDeliveryPrice)(state);
  },
  isCallBack: (state: RootState) => state.order.isCallBack,
  getContact: (state: RootState) => state.order.contact,
  getDate: (state: RootState) => state.order.date,
  getTime: (state: RootState) => state.order.time,
  getAnonymousMessage: (state: RootState) => state.order.anonymousMessage,
  getAddressId: (state: RootState) => state.order.addressId,
  getCommentAddress: (state: RootState) => state.order.commentAddress,
  getNumberOrder: (state: RootState) => state.order.numberOrder,
  getStatusPayment: (state: RootState) => state.order.statusPayment,
  getIsEditable: (state: RootState) =>
    state.order.statusPayment !== StatusPayment.payment,
};

export {actionsOrder, selectorsOrder};
export default creator.createReducer(init);
