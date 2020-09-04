import {useState} from 'react';
import {formatAddress} from '../utils/formatAddress';
import service from '../services/service';
import {actionsOrder, selectorsOrder} from '../redux/order/orderReducer';
import {actionsOther, selectorsOther} from '../redux/other/otherReducer';
import {useDispatch, useSelector} from 'react-redux';
import {selectorsCart} from '../redux/cart/cartReducer';
import {selectorsUser} from '../redux/user/userReducer';

export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const products = useSelector(selectorsCart.getCartProducts);
  const idSellPoint = useSelector(selectorsCart.getIdSellPoint);
  const data = useSelector(selectorsOrder.getOrder);
  const draftId = useSelector(selectorsOther.getDraftId);
  const addresses = useSelector(selectorsUser.getAddresses);

  const createOrder = async () => {
    setLoading(true);
    const address = formatAddress(
      addresses.find((a) => a.id === data.addressId)!,
    );
    await service.saveCart(products, idSellPoint);
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
      return true;
    } catch (e) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {loading, createOrder};
};
