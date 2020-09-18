import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MyText from '../../controls/MyText';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {getFontFamily} from '../../../utils/getFontFamily';
import {ScrollView} from 'react-native-gesture-handler';
import {FinalStepScreenProps} from '../../navigators/Order.navigator';
import {useDispatch, useSelector} from 'react-redux';
import {actionsOrder, selectorsOrder} from '../../../redux/order/orderReducer';
import {actionsCart, selectorsCart} from '../../../redux/cart/cartReducer';
import CartItem, {PurchaseItem} from '../../common/CartItem';
import {useFormattingContext} from '../../../context/FormattingContext';
import {ICartItem} from '../../../typings/FetchData';
import {selectorsUser} from '../../../redux/user/userReducer';
import MyButton from '../../controls/MyButton';
import {formatAddress} from '../../../utils/formatAddress';
import {selectorsOther} from '../../../redux/other/otherReducer';

const FinalStepScreen = React.memo(
  ({navigation, route}: FinalStepScreenProps) => {
    const dispatch = useDispatch();
    const {border, lightBackground} = useTheme();
    const {formatPrice} = useFormattingContext();
    const defaultSellPoint = useSelector(selectorsOther.getIdSellPoint);
    const client = useSelector(selectorsUser.getUser);
    const contact = useSelector(selectorsOrder.getContact);
    const deliveryPrice = useSelector(selectorsOrder.getDeliveryPrice);
    const numberOrder = useSelector(selectorsOrder.getNumberOrder) || 1;
    const sum = useSelector(selectorsCart.getGeneralSum);
    const idSellPoint = useSelector(selectorsCart.getIdSellPoint);
    const items = useSelector(selectorsCart.getCartProducts);
    const isDelivery = useSelector(selectorsOrder.isDeliveryCourier);
    const address = useSelector(selectorsOrder.getAddress);
    const sellPoint = useSelector(selectorsOrder.getSellPoint)!;
    const [snapShot, setSnapshot] = useState({
      sum: 0,
      items: [] as ICartItem[],
      idSellPoint: undefined as undefined | number,
    });

    useEffect(() => {
      setSnapshot({
        sum,
        items,
        idSellPoint,
      });
      dispatch(actionsCart.clear(defaultSellPoint));
      return () => {
        dispatch(actionsOrder.clear());
      };
    }, []);

    const handleOrders = () => {
      navigation.replace('MenuNavigator', {
        screen: 'Orders',
      });
    };

    const handleContinue = () => {
      navigation.replace('MainNavigator', {
        screen: 'Restaurant',
      });
    };

    const cartItems = items.length > 0 ? items : snapShot.items;
    let cartSum = items.length > 0 ? sum : snapShot.sum;

    cartSum = isDelivery ? cartSum + deliveryPrice : cartSum;

    const user = (contact || client)!;

    return (
      <SafeAreaView style={[styles.container]}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <MyText style={styles.welcome}>
            Дякуємо, ваше замовлення прийняте!
          </MyText>
          <View style={[styles.view, {borderBottomColor: border}]}>
            <MyText style={styles.order}>
              Замовлення № {numberOrder.toString().padStart(9, '0')}
            </MyText>
          </View>
          {cartItems.map((p) => {
            return (
              <CartItem
                item={p}
                key={p.product.id}
                defaultSellPoint={idSellPoint}
                isEdit={false}
              />
            );
          })}
          <View style={styles.totalPrice}>
            <MyText style={styles.title}>Загальна сума</MyText>
            <MyText style={styles.price}>{formatPrice(cartSum)}</MyText>
          </View>

          <View
            style={{
              backgroundColor: lightBackground,
              marginBottom: sizes[10],
              paddingHorizontal: sizes[5],
              paddingVertical: sizes[10],
            }}>
            <MyText style={styles.title}>Одержувач замовлення</MyText>
            <MyText style={styles.title}>{`${user!.firstName} ${
              user!.lastName
            }`}</MyText>
            <MyText style={styles.text}>{user.phone}</MyText>
            {isDelivery ? (
              <View>
                <MyText style={styles.title}>Адреса</MyText>
                <MyText style={styles.text}>{formatAddress(address)}</MyText>
              </View>
            ) : (
              <View>
                <MyText style={styles.title}>Забрати особисто: </MyText>
                <MyText style={styles.title}>{sellPoint.name}</MyText>
                <MyText style={styles.text}>{sellPoint.address}</MyText>
              </View>
            )}
          </View>
          <MyButton
            onPress={handleOrders}
            style={styles.btn}
            styleText={styles.text}
            type={'default'}
            isActive>
            Мои замовлення
          </MyButton>
          <MyButton
            style={styles.btn}
            onPress={handleContinue}
            styleText={styles.text}>
            Продовжити покупки
          </MyButton>
        </ScrollView>
      </SafeAreaView>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: sizes[5],
  },
  scroll: {
    marginVertical: sizes[10],
  },
  welcome: {
    fontSize: sizes[12],
    fontFamily: getFontFamily('500'),
    textAlign: 'center',
    marginBottom: sizes[20],
    paddingTop: sizes[10],
  },
  order: {
    fontSize: sizes[9],
    fontFamily: getFontFamily('500'),
    marginBottom: sizes[7],
  },
  view: {
    borderBottomWidth: 1,
  },
  totalPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sizes[20],
    marginTop: sizes[5],
  },
  price: {
    fontSize: sizes[12],
    fontFamily: getFontFamily('500'),
  },
  title: {
    fontSize: sizes[9],
    fontFamily: getFontFamily('500'),
    marginVertical: sizes[2],
  },
  text: {
    fontSize: sizes[9],
  },
  btn: {
    marginBottom: sizes[5],
  },
});

export default FinalStepScreen;
