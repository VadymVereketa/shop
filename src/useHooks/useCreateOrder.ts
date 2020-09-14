import {useState} from 'react';
import {formatAddress} from '../utils/formatAddress';
import service from '../services/service';
import {actionsOrder, selectorsOrder} from '../redux/order/orderReducer';
import {actionsOther, selectorsOther} from '../redux/other/otherReducer';
import {useDispatch, useSelector} from 'react-redux';
import {selectorsCart} from '../redux/cart/cartReducer';
import {selectorsUser} from '../redux/user/userReducer';
import portmone from '../utils/portmone';
import {TypePayment} from '../constants/constantsId';

export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const data = useSelector(selectorsOrder.getOrder);
  const draftId = useSelector(selectorsOther.getDraftId);
  const addresses = useSelector(selectorsUser.getAddresses);
  const id = useSelector(selectorsOrder.getCardId);
  const card = useSelector(selectorsUser.getCard(id))!;
  const user = useSelector(selectorsUser.getUser)!;
  const sum = useSelector(selectorsCart.getGeneralSum);
  const deliveryPrice = useSelector(selectorsOrder.getDeliveryPrice);
  const isWeightProducts = useSelector(selectorsCart.getIsWeightProducts);
  const products = useSelector(selectorsCart.getCartProducts);
  const idSellPoint = useSelector(selectorsCart.getIdSellPoint);
  const paymentType = useSelector(selectorsOrder.getCodePayment);
  const totalPrice = sum + deliveryPrice;

  const createOrder = async () => {
    const address = formatAddress(
      addresses.find((a) => a.id === data.addressId)!,
    );
    dispatch(
      actionsOrder.setData({
        numberOrder: draftId!,
        address,
      }),
    );
    data.address = address;
    try {
      const res = await service.createOrder(draftId!, data);
      if (res.success) {
        dispatch(
          actionsOther.setData({
            draftId: null,
          }),
        );
      }
      return res.success;
    } catch (e) {
      return false;
    }
  };

  const handlePay = async () => {
    let res: any = null;

    const billAmount = isWeightProducts
      ? totalPrice + totalPrice * 0.15
      : totalPrice;
    if (id === -1) {
      res = await portmone.initCardPayment({
        billAmount,
        phoneNumber: user.phone,
        preAuth: true,
        billNumber: draftId!.toString(),
      });
    } else {
      res = await portmone.tokenCardPayment({
        billAmount,
        preAuth: true,
        billNumber: draftId!.toString(),
        desc: card.description,
        token: card.token,
        cardMask: card.number,
      });
    }
    if (res.result === 'success') {
      const result = await service.preAuthPayment({
        ...res,
        SHOPORDERNUMBER: draftId,
      });
      return result.success;
    }
    return false;
  };

  const submit = async () => {
    setLoading(true);
    const cart = await service.saveCart(products, idSellPoint!);
    if (cart.success) {
      let isPay = true;
      if (paymentType === TypePayment.online) {
        isPay = await handlePay();
      }

      if (isPay) {
        const res = await createOrder();

        setLoading(false);
        return res;
      }
    }

    setLoading(false);
    return false;
  };

  return {loading, submit};
};
