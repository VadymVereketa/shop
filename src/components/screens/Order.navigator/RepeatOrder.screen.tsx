import React, {useEffect} from 'react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {RepeatOrderScreenProps} from '../../navigators/Order.navigator';
import {useDispatch, useSelector} from 'react-redux';
import {actionsCart, selectorsCart} from '../../../redux/cart/cartReducer';
import CartItem from '../../common/CartItem';
import {StyleSheet, View} from 'react-native';
import {sizes, useTheme} from '../../../context/ThemeContext';
import MyText from '../../controls/MyText';
import PressTitle from '../../controls/PressTitle';
import {actionsOrder, selectorsOrder} from '../../../redux/order/orderReducer';
import {getFontFamily} from '../../../utils/getFontFamily';
import DateInput from '../../common/DateInput';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import {usePaymentOptions} from '../../../useHooks/usePaymentOptions';
import MyButton from '../../controls/MyButton';
import {useFormattingContext} from '../../../context/FormattingContext';
import {useCreateOrder} from '../../../useHooks/useCreateOrder';
import {formatAddress} from '../../../utils/formatAddress';
import {selectorsOther} from '../../../redux/other/otherReducer';

const RepeatOrderScreen = ({navigation, route}: RepeatOrderScreenProps) => {
  const params = route.params || {};
  const paramOption = params.option;

  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const {primary, background, text} = useTheme();
  const {formatPrice} = useFormattingContext();
  let sum = useSelector(selectorsCart.getGeneralSum);
  const defaultSellPoint = useSelector(selectorsOther.getIdSellPoint);
  const deliveryPrice = useSelector(selectorsOrder.getDeliveryPrice);
  const products = useSelector(selectorsCart.getCartProducts);
  const isCourier = useSelector(selectorsOrder.isDeliveryCourier);
  const payment = useSelector(selectorsOrder.getCodePayment);
  const address = useSelector(selectorsOrder.getAddress);
  const sellPoint = useSelector(selectorsOrder.getSellPoint);
  const isCreateOrder = useSelector(selectorsOrder.isCreateOrder);
  const options = usePaymentOptions();
  const {loading, submit} = useCreateOrder();

  useEffect(() => {
    dispatch(
      actionsOrder.setData({
        isRepeatOrder: true,
      }),
    );

    return () => {
      dispatch(actionsOrder.clear());
      dispatch(actionsCart.clear(defaultSellPoint));
    };
  }, []);

  useDidUpdateEffect(() => {
    if (paramOption) {
      dispatch(
        actionsOrder.setData({
          date: paramOption.date,
          time: paramOption.time,
        }),
      );
    }
  }, [paramOption]);

  const handleDeliveryPress = () => {
    navigation.navigate('Delivery', {});
  };

  const handlePaymentPress = () => {
    navigation.navigate('Payment', {});
  };

  const handleMoreProducts = () => {
    navigation.push('MainNavigator', {
      screen: 'Restaurant',
    });
  };

  const handleContinue = async () => {
    const res = await submit();
    if (res) {
      navigation.navigate('FinalStep', {});
    }
  };

  const option = options.find((o) => o.code === payment);

  return (
    <SafeAreaView
      style={[
        styles.con,
        {
          marginTop: -insets.top,
          marginBottom: -insets.bottom,
        },
      ]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        {products.map((p) => {
          return <CartItem key={p.product.id} item={p} />;
        })}

        <View style={styles.viewAddProduct}>
          <MyText style={{color: primary}} onPress={handleMoreProducts}>
            + додати більше продуктів
          </MyText>
        </View>
        <PressTitle style={styles.press} onPress={handleDeliveryPress}>
          Спосіб отримання
        </PressTitle>
        {isCourier ? (
          <View style={styles.viewDelivery}>
            <MyText style={[styles.textDelivery, {color: primary}]}>
              Доставка кур'єром
            </MyText>
            <MyText style={styles.title}>Адреса:</MyText>
            <MyText style={styles.text}>{formatAddress(address)}</MyText>
          </View>
        ) : (
          <View style={styles.viewDelivery}>
            <MyText style={[styles.textDelivery, {color: primary}]}>
              Забрати особисто
            </MyText>
            {sellPoint ? (
              <MyText style={styles.text}>
                <MyText style={styles.title}>{sellPoint.name + ' '}</MyText>
                <MyText>{sellPoint.address}</MyText>
              </MyText>
            ) : (
              <MyText style={styles.text}>
                Оберіть магазин для отримання замовлення
              </MyText>
            )}
          </View>
        )}
        <DateInput navigate="RepeatOrder" />
        <PressTitle style={styles.press} onPress={handlePaymentPress}>
          Cпосіб оплати
        </PressTitle>
        {option && <MyText>{option.title}</MyText>}
      </ScrollView>
      <View
        style={[
          styles.bottomBlock,
          {
            backgroundColor: background,
            paddingBottom: insets.bottom || sizes[5],
            shadowColor: text,
          },
        ]}>
        {isCourier && (
          <View style={[styles.price, {marginBottom: 0}]}>
            <MyText style={styles.delivery}>Доставка</MyText>
            <MyText style={styles.bottomBlockText}>
              {formatPrice(deliveryPrice)}
            </MyText>
          </View>
        )}
        <View style={styles.price}>
          <MyText style={styles.bottomBlockText}>Сума за замовлення</MyText>
          <MyText style={styles.priceText}>{formatPrice(sum)}</MyText>
        </View>
        <MyButton
          styleText={styles.btn}
          isLoading={loading}
          disabled={!isCreateOrder}
          onPress={handleContinue}>
          продовжити
        </MyButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  con: {
    justifyContent: 'space-between',
    flex: 1,
  },
  scroll: {
    marginHorizontal: sizes[5],
    paddingBottom: sizes[10],
  },
  viewAddProduct: {
    paddingTop: sizes[10],
    justifyContent: 'center',
    alignItems: 'center',
  },
  press: {
    paddingLeft: 0,
    marginBottom: sizes[5],
    marginTop: sizes[10],
  },
  viewDelivery: {
    marginBottom: sizes[10],
  },
  textDelivery: {
    textTransform: 'uppercase',
    fontFamily: getFontFamily('500'),
  },
  title: {
    fontSize: sizes[9],
    fontFamily: getFontFamily('500'),
  },
  text: {
    fontSize: sizes[9],
  },

  bottomBlock: {
    paddingVertical: sizes[10],
    paddingHorizontal: sizes[5],
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 15,
  },
  btn: {
    fontSize: sizes[9],
  },
  price: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sizes[10],
  },

  priceText: {
    fontFamily: getFontFamily('500'),
    fontSize: sizes[12],
  },
  bottomBlockText: {
    fontFamily: getFontFamily('500'),
    fontSize: sizes[9],
  },
  delivery: {
    fontFamily: getFontFamily('500'),
  },
});

export default RepeatOrderScreen;
