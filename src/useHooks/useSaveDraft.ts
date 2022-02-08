import {IDraft} from '../typings/FetchData';
import {useDispatch, useSelector} from 'react-redux';
import {selectorsCart} from '../redux/cart/cartReducer';
import {actionsOrder, selectorsOrder} from '../redux/order/orderReducer';
import {actionsOther, selectorsOther} from '../redux/other/otherReducer';
import {formatAddress} from '../utils/formatAddress';
import {selectorsUser} from '../redux/user/userReducer';
import service from '../services/service';

const useSaveDraft = () => {
  const dispatch = useDispatch();
  const productsPrice = useSelector(selectorsCart.getGeneralSum);
  const products = useSelector(selectorsCart.getCartProducts);
  const sellPointCardId = useSelector(selectorsCart.getIdSellPoint);
  const deliveryType = useSelector(selectorsOrder.getDeliveryType)!;
  const paymentType = useSelector(selectorsOrder.getPaymentType)!;
  const draftId = useSelector(selectorsOther.getDraftId);
  const orderAddress = useSelector(selectorsOrder.getAddress);
  const user = useSelector(selectorsUser.getUser)!;

  const fetchData: IDraft = {
    productsPrice,
    purchases: products.map((p) => {
      const po = p.product.productOptions.find(
        (po) => po.sellPoint.id === sellPointCardId,
      )!;
      return {
        product: {
          id: p.product.id,
        },
        count: p.count,
        alternativeCount: p.alternativeCount,
        comment: p.comment,
        price: po ? +po.price : 1,
        services: p.services,
      };
    }),
    comment: null,
    deliveryType: deliveryType
      ? {
          id: deliveryType.id,
        }
      : undefined,
    paymentType: paymentType
      ? {
          id: paymentType.id,
        }
      : undefined,
    id: draftId ? draftId : undefined,
    sellPoint: {
      id: sellPointCardId!,
      name: '',
    },
    orderAddress: orderAddress ? formatAddress(orderAddress) : '',
    firstName: user.firstName,
    lastName: user.lastName!,
    phone: user.phone,
  };

  return async () => {
    let res = await service.createDraft(fetchData);
    if (res.code === 401) {
      return Promise.reject(res);
    }
    if (!res.success) {
      dispatch(
        actionsOther.setData({
          draftId: null,
        }),
      );
      fetchData.id = null;
      res = await service.createDraft(fetchData);
      if (res.success) {
        dispatch(
          actionsOther.setData({
            draftId: res.data.id,
          }),
        );
      }
    }

    return res.success ? Promise.resolve(res) : Promise.reject(res);
  };
};

export default useSaveDraft;
