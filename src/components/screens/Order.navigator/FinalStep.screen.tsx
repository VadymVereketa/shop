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
import t from '../../../utils/translate';

const FinalStepScreen = React.memo(
  ({navigation, route}: FinalStepScreenProps) => {
    const dispatch = useDispatch();
    const {border, lightBackground} = useTheme();
    const {formatPrice, longFormatDate} = useFormattingContext();
    const defaultSellPoint = useSelector(selectorsOther.getIdSellPoint);
    const client = useSelector(selectorsUser.getUser);
    const contact = useSelector(selectorsOrder.getContact);
    const deliveryPrice = useSelector(selectorsOrder.getDeliveryPrice);
    const numberOrder = useSelector(selectorsOrder.getNumberOrder)!;
    const draftId = useSelector(selectorsOther.getDraftId)!;
    const sum = useSelector(selectorsCart.getGeneralSum);
    const idSellPoint = useSelector(selectorsCart.getIdSellPoint);
    const items = useSelector(selectorsCart.getCartProducts);
    const isSelf = useSelector(selectorsOrder.isDeliverySelf);
    const isExpress = useSelector(selectorsOrder.isDeliveryExpress);
    const address = useSelector(selectorsOrder.getAddress);
    const sellPoint = useSelector(selectorsOrder.getSellPoint)!;
    const expressSellPoint = useSelector(selectorsOrder.getExpressSellPoint)!;
    const date = useSelector(selectorsOrder.getDate)!;
    const time = useSelector(selectorsOrder.getTime)!;
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

    const totalSum = isSelf ? cartSum : cartSum + deliveryPrice;

    const user = (contact || client)!;

    const sp = sellPoint ?? expressSellPoint;

    return (
      <SafeAreaView style={[styles.container]}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <MyText style={styles.welcome}>{t('successOrder')}</MyText>
          <View style={[styles.view, {borderBottomColor: border}]}>
            <MyText style={styles.order}>
              {t('profileMyOrder')} №{' '}
              {(numberOrder || draftId).toString().padStart(9, '0')}
            </MyText>
          </View>
          {cartItems.map((p) => {
            return (
              <CartItem
                item={p}
                key={p.product.id}
                defaultSellPoint={snapShot.idSellPoint}
                isEdit={false}
              />
            );
          })}
          <View style={{marginTop: sizes[5]}} />
          {!!deliveryPrice && (
            <View style={[styles.totalPrice, {marginBottom: 0, marginTop: 0}]}>
              <MyText style={styles.title}>{t('commonDelivery')}</MyText>
              <MyText style={[styles.price, {fontSize: sizes[10]}]}>
                {formatPrice(deliveryPrice)}
              </MyText>
            </View>
          )}
          <View style={[styles.totalPrice, {marginBottom: 0, marginTop: 0}]}>
            <MyText style={styles.title}>{t('cartSum')}</MyText>
            <MyText style={[styles.price, {fontSize: sizes[10]}]}>
              {formatPrice(cartSum)}
            </MyText>
          </View>
          <View style={styles.totalPrice}>
            <MyText style={styles.title}>{t('commonSum')}</MyText>
            <MyText style={styles.price}>{formatPrice(totalSum)}</MyText>
          </View>

          <View
            style={{
              backgroundColor: lightBackground,
              marginBottom: sizes[10],
              paddingHorizontal: sizes[5],
              paddingVertical: sizes[10],
            }}>
            <MyText style={styles.title}>{t('orderTitleReceiver')}</MyText>
            <MyText style={styles.title}>{`${user!.firstName} ${
              user!.lastName
            }`}</MyText>
            <MyText style={styles.text}>{user.phone}</MyText>
            {!isSelf ? (
              <View>
                <MyText style={styles.title}>{t('commonAddress')}</MyText>
                <MyText style={styles.text}>{formatAddress(address)}</MyText>
              </View>
            ) : (
              <View>
                <MyText style={styles.title}>{t('btnSelf')}: </MyText>
                <MyText style={styles.title}>{sp.name}</MyText>
                <MyText style={styles.text}>{sp.address}</MyText>
              </View>
            )}
            {!isExpress && (
              <React.Fragment>
                <MyText style={styles.title}>{t('commonDateTime')}</MyText>
                <MyText style={styles.text}>
                  {longFormatDate(date)} {time}
                </MyText>
              </React.Fragment>
            )}
          </View>
          <MyButton
            onPress={handleOrders}
            style={styles.btn}
            styleText={styles.text}
            type={'default'}
            isActive>
            {t('profileMyOrders')}
          </MyButton>
          <MyButton
            style={styles.btn}
            onPress={handleContinue}
            styleText={styles.text}>
            {t('btnContinueOrder')}
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
