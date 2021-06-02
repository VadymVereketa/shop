import {CreatorReducer} from '../base/base';
import {IOrderActions, IOrderState, StatusPayment} from './orderTypes';
import {RootState} from '../reducer';
import {selectorsOther} from '../other/otherReducer';
import {TypeDelivery} from '../../constants/constantsId';
import {selectorsTypes} from '../types/typeReducer';
import {getSellPoint} from '../sellPoints/sellPointsReducer';
import {selectorsUser} from '../user/userReducer';

const init: IOrderState = {
  address: '',
  deliveryType: null,
  paymentType: null,
  step: 1,
  contact: null,
  sellPoint: null,
  isCallBack: false,
  date: null,
  time: '',
  anonymousMessage: null,
  addressId: -1,
  commentAddress: '',
  numberOrder: null,
  idDeliveryPrice: 1,
  statusPayment: StatusPayment.defult,
  isRepeatOrder: false,
  cardId: -1,
  expressSellPoint: null,
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
  getAddress: (state: RootState) => {
    return selectorsUser
      .getAddresses(state)
      .find((a) => a.id === state.order.addressId);
  },
  isDeliveryCourier: (state: RootState) => {
    if (state.order.deliveryType === null) return false;
    return state.order.deliveryType!.code === TypeDelivery.courier;
  },
  isDeliverySelf: (state: RootState) => {
    if (state.order.deliveryType === null) return false;
    return state.order.deliveryType!.code === TypeDelivery.self;
  },
  isDeliveryExpress: (state: RootState) => {
    if (state.order.deliveryType === null) return false;
    return state.order.deliveryType!.code === TypeDelivery.express;
  },
  getPaymentType: (state: RootState) => {
    return state.order.paymentType;
  },
  getCodePayment: (state: RootState) =>
    state.order.paymentType ? state.order.paymentType.code : '',
  getSellPointId: (state: RootState) => state.order.sellPoint,
  getSellPoint: (state: RootState) => {
    return getSellPoint(state.order.sellPoint!)(state) ?? null;
  },
  getDeliveryPrice: (state: RootState) => {
    if (
      state.order.deliveryType &&
      state.order.deliveryType.code === TypeDelivery.self
    ) {
      return 0;
    }
    if (state.order.addressId === -1) {
      return 0;
    }
    const address = selectorsUser.getAddressById(state.order.addressId)(state)!;
    return selectorsOther.getDeliveryPrice(
      address.addressDictionary
        ? address.addressDictionary.district.deliveryPrice.id
        : -1,
    )(state);
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
  getDeliveryType: (state: RootState) => state.order.deliveryType,
  isAllowThirdStep: (state: RootState) => {
    if (state.order.deliveryType) {
      if (state.order.deliveryType.code === TypeDelivery.self) {
        return state.order.sellPoint !== null && state.order.date !== null;
      } else {
        return state.order.addressId !== -1 && state.order.date !== null;
      }
    } else {
      return false;
    }
  },
  isCreateOrder: (state: RootState) => {
    if (selectorsOrder.isAllowThirdStep(state)) {
      return !!state.order.paymentType;
    } else {
      return false;
    }
  },
  isRepeatOrder: (state: RootState) => {
    return state.order.isRepeatOrder;
  },
  getCardId: (state: RootState) => {
    return state.order.cardId;
  },
  getExpressSellPoint: (state: RootState) => state.order.expressSellPoint,
};

export {actionsOrder, selectorsOrder};
export default creator.createReducer(init);
