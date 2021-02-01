import {IDraft} from '../typings/FetchData';
import {useDispatch, useSelector} from 'react-redux';
import {selectorsCart} from '../redux/cart/cartReducer';
import {selectorsOrder} from '../redux/order/orderReducer';
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
    id: draftId!,
    sellPoint: {
      id: sellPointCardId,
      name: '',
    },
    orderAddress: orderAddress ? formatAddress(orderAddress) : '',
    firstName: user.firstName,
    lastName: user.lastName!,
    phone: user.phone,
  };

  return () => {
    return service.createDraft(fetchData).then((res) => {
      if (res.success) {
        dispatch(
          actionsOther.setData({
            draftId: res.data.id,
          }),
        );
      }
    });
  };
};

export default useSaveDraft;
