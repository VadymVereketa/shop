import React, {useRef, useState} from 'react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import PressTitle from '../controls/PressTitle';
import Animated, {Easing, timing} from 'react-native-reanimated';
import {sizes, useTheme} from '../../context/ThemeContext';
import CartItem from './CartItem';
import MyText from '../controls/MyText';
import {StyleSheet, View} from 'react-native';
import MyButton from '../controls/MyButton';
import {getFontFamily} from '../../utils/getFontFamily';
import {useDispatch, useSelector} from 'react-redux';
import {selectorsCart} from '../../redux/cart/cartReducer';
import {useFormattingContext} from '../../context/FormattingContext';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import {selectorsOrder} from '../../redux/order/orderReducer';
import {TypeDelivery} from '../../constants/constantsId';
import t from '../../utils/translate';

interface IBlockOrderProps {
  handleContinue: any;
  children: any;
  isLoading?: boolean;
  disabled?: boolean;
}
const BlockWrapperOrder = React.memo(
  ({
    handleContinue,
    children,
    isLoading = false,
    disabled = false,
  }: IBlockOrderProps) => {
    const items = useSelector(selectorsCart.getCartProducts);
    const h = items.length > 1 ? sizes[100] + sizes[50] : sizes[90];
    const offsetY = useRef(new Animated.Value(-h)).current;
    const [isShow, setIsShow] = useState(false);
    const insets = useSafeAreaInsets();
    let sum = useSelector(selectorsCart.getGeneralSum);
    const isCourier = useSelector(selectorsOrder.isDeliveryCourier);
    const deliveryPrice = useSelector(selectorsOrder.getDeliveryPrice);
    const {lightBackground, background, text, theme} = useTheme();
    const {formatPrice} = useFormattingContext();

    const handleToggle = () => {
      setIsShow((s) => !s);
    };

    useDidUpdateEffect(() => {
      timing(offsetY, {
        toValue: isShow ? 0 : -h,
        duration: 300,
        easing: Easing.ease,
      }).start();
    }, [isShow]);

    sum = sum + (isCourier ? deliveryPrice : 0);

    return (
      <SafeAreaView
        style={[
          styles.container,
          {marginTop: -insets.top, marginBottom: -insets.bottom},
        ]}>
        <ScrollView
          style={{marginBottom: isShow ? 0 : -h}}
          bounces={false}
          scrollEnabled={!isShow}>
          {isLoading && (
            <View
              style={[
                styles.loading,
                {
                  backgroundColor: theme === 'dark' ? lightBackground : text,
                },
              ]}
            />
          )}
          <PressTitle
            expand
            style={[{backgroundColor: lightBackground}]}
            onPress={handleToggle}>
            {t('profileMyOrder')}
          </PressTitle>
          <Animated.ScrollView
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{
              height: h,
              zIndex: -10,
              marginHorizontal: sizes[5],
              transform: [
                {
                  translateY: offsetY,
                },
              ],
            }}>
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </Animated.ScrollView>
          <Animated.View
            style={[
              styles.body,
              {
                transform: [
                  {
                    translateY: offsetY,
                  },
                ],
              },
            ]}>
            {children}
          </Animated.View>
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
              <MyText style={styles.delivery}>{t('btnDelivery')}</MyText>
              <MyText style={styles.bottomBlockText}>
                {formatPrice(deliveryPrice)}
              </MyText>
            </View>
          )}
          <View style={styles.price}>
            <MyText style={styles.bottomBlockText}>{t('orderSumOrder')}</MyText>
            <MyText style={styles.priceText}>{formatPrice(sum)}</MyText>
          </View>
          <MyButton
            styleText={styles.btn}
            isLoading={isLoading}
            disabled={disabled}
            onPress={handleContinue}>
            {t('btnContinue')}
          </MyButton>
        </View>
      </SafeAreaView>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    marginHorizontal: sizes[5],
    paddingBottom: sizes[10],
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

  loading: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    opacity: 0.8,
  },
});
export default BlockWrapperOrder;
