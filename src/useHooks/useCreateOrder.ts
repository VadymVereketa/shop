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
import Toast from 'react-native-simple-toast';
import {useTheme} from '../context/ThemeContext';
import {useFormattingContext} from '../context/FormattingContext';
import FirebaseCrash from '../Crashlytics/FirebaseCrash';
import CrashTypeError from '../typings/CrashTypeError';
import {SelectorCity} from '../redux/city/cityReducer';

export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {theme} = useTheme();
  const {currentLocale} = useFormattingContext();
  const increasePercentage = useSelector(selectorsOther.getIncreasePercentage);
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
  const deliveryType = useSelector(selectorsOrder.getDeliveryType)!;
  const idCity = useSelector(SelectorCity.getSelectedCityId);
  const totalPrice = sum + deliveryPrice;

  const createOrder = async () => {
    FirebaseCrash.log('---------------start createOrder------------------');
    const address = formatAddress(
      addresses.find((a) => a.id === data.addressId)!,
    );
    dispatch(
      actionsOrder.setData({
        numberOrder: draftId!,
        address,
      }),
    );
    data.orderAddress = address;
    try {
      const res = await service.createOrder({
        draftId: draftId!,
        data,
        idCity,
      });

      if (!res.success) {
        throw new Error();
      }

      dispatch(
        actionsOther.setData({
          draftId: null,
        }),
      );
      dispatch(
        actionsOrder.setData({
          numberOrder: res.data.id,
        }),
      );

      return true;
    } catch (e) {
      FirebaseCrash.catch(e, CrashTypeError.createOrder);
      const res = await service.createOrder({
        data,
        draftId: undefined,
        idCity,
      });
      if (!res.success) {
        return false;
      }

      dispatch(
        actionsOrder.setData({
          numberOrder: res.data.id,
        }),
      );

      return true;
    } finally {
      dispatch(
        actionsOther.setData({
          draftId: null,
        }),
      );
      FirebaseCrash.log('---------------end createOrder------------------');
    }
  };

  const handlePay = async () => {
    try {
      FirebaseCrash.log('---------------start handlePay------------------');
      let res: any = null;

      const billAmount = isWeightProducts
        ? totalPrice + totalPrice * (increasePercentage / 100)
        : totalPrice;
      if (id === -1) {
        res = await portmone.initCardPayment({
          billAmount,
          phoneNumber: user.phone,
          preAuth: true,
          billNumber: draftId!.toString(),
          lang: currentLocale,
          theme,
        });
      } else {
        res = await portmone.tokenCardPayment({
          billAmount,
          preAuth: true,
          billNumber: draftId!.toString(),
          desc: card.description,
          token: card.token,
          cardMask: card.number,
          lang: currentLocale,
          theme,
        });
      }
      FirebaseCrash.log(res);
      if (res.result === 'success') {
        FirebaseCrash.log(
          '---------------start preAuthPayment------------------',
        );
        const result = await service.preAuthPayment({
          ...res,
          SHOPORDERNUMBER: draftId,
        });
        FirebaseCrash.log(result);
        FirebaseCrash.log(
          '---------------start preAuthPayment------------------',
        );
        if (!result.success) {
          Toast.show('Помилка при оплатi');
        }

        return result.success;
      }
      return false;
    } catch (e: any) {
      FirebaseCrash.catch(e, CrashTypeError.portmone);
      return false;
    } finally {
      FirebaseCrash.log('---------------end handlePay------------------');
    }
  };

  const submit = async () => {
    FirebaseCrash.log('\n\n\n---------------=START=------------------');
    setLoading(true);
    FirebaseCrash.log('---------------start saveCart------------------');
    const cart = await service.saveCart(
      products,
      idSellPoint!,
      deliveryType.id,
      idCity,
    );
    FirebaseCrash.log(cart);
    FirebaseCrash.log('---------------end saveCart------------------');
    if (cart.success) {
      let isPay = true;
      if (paymentType === TypePayment.online) {
        isPay = await handlePay();
      }

      if (isPay) {
        const res = await createOrder();

        if (!res) {
          Toast.show('Помилка при створенні замовлення');
        }
        setLoading(false);
        FirebaseCrash.log('\n\n\n---------------end------------------');
        return res;
      }
    }
    setLoading(false);
    FirebaseCrash.log('\n\n\n---------------=END=------------------');
    return false;
  };

  return {loading, submit};
};
