import {ICartItem, IContact, IOrderFull, IProduct} from '../typings/FetchData';
import {useDispatch, useSelector} from 'react-redux';
import {actionsCart} from '../redux/cart/cartReducer';
import {actionsOrder} from '../redux/order/orderReducer';
import {useNavigation} from '@react-navigation/core';
import {OrdersScreenNavigationProp} from '../components/navigators/Menu.navigator';
import {useCallback} from 'react';
import {selectorsUser} from '../redux/user/userReducer';
import {formatAddress} from '../utils/formatAddress';

export const useRepeatOrder = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<OrdersScreenNavigationProp>();
  const addresses = useSelector(selectorsUser.getAddresses);

  return useCallback((data: IOrderFull, products: IProduct[]) => {
    const res: ICartItem[] = data.purchases.map((pur) => {
      const cartItem: ICartItem = {
        count: +pur.count,
        comment: pur.comment,
        product: products.find((p) => p.id === pur.product.id)!,
        alternativeCount: pur.alternativeCount,
      };
      return cartItem;
    });
    dispatch(actionsCart.setData(res));
    let contact: IContact | null = null;
    if (data.contact) {
      contact = data.contact;
    }
    const addressId = data.address ? data.address.id : -1;
    const address = addresses.find((a) => a.id === addressId);
    dispatch(
      actionsOrder.setData({
        address: address ? formatAddress(address) : '',
        addressId,
        commentAddress:
          data.address && data.address.notes ? data.address.notes : '',
        deliveryType: data.deliveryType,
        contact,
      }),
    );
    navigation.navigate('OrderNavigator', {
      screen: 'RepeatOrder',
    });
  }, []);
};
