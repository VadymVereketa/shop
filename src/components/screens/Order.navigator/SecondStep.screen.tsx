import React, {useRef, useState} from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import PressTitle from '../../controls/PressTitle';
import MyText from '../../controls/MyText';
import {getFontFamily} from '../../../utils/getFontFamily';
import {sizes, useTheme} from '../../../context/ThemeContext';
import MyButton from '../../controls/MyButton';
import {useSelector} from 'react-redux';
import {selectorsCart} from '../../../redux/cart/cartReducer';
import {useFormattingContext} from '../../../context/FormattingContext';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {BoxShadow} from 'react-native-shadow';
import {useResponsiveWidth} from 'react-native-responsive-dimensions';
import BlockDelivery from '../../common/BlockDelivery';
import Animated, {Easing, timing} from 'react-native-reanimated';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import CartItem from '../../common/CartItem';

const h = sizes[100] + sizes[50];

const SecondStepScreen = (props: any) => {
  const offsetY = useRef(new Animated.Value(-h)).current;
  const [isShow, setIsShow] = useState(false);
  const insets = useSafeAreaInsets();
  const sum = useSelector(selectorsCart.getGeneralSum);
  const items = useSelector(selectorsCart.getCartProducts);
  const {border} = useTheme();
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
        <PressTitle expand style={styles.order} onPress={handleToggle}>
          Замовлення
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
          <MyText style={styles.text}>Оберіть спосіб отримання</MyText>
          <BlockDelivery />
        </Animated.View>
      </ScrollView>
      <View
        style={[
          styles.bottomBlock,
          {
            backgroundColor: 'white',
            paddingBottom: insets.bottom || sizes[5],
            paddingLeft: insets.left || sizes[5],
            paddingRight: insets.right || sizes[5],
            marginLeft: -insets.left,
            marginRight: -insets.right,
          },
        ]}>
        <View style={styles.price}>
          <MyText style={styles.bottomBlockText}>Сума за замовлення</MyText>
          <MyText style={styles.priceText}>{formatPrice(sum)}</MyText>
        </View>
        <MyButton styleText={styles.btn}>продовжити</MyButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  order: {
    backgroundColor: '#f9f9f9',
  },
  text: {
    fontFamily: getFontFamily('500'),
    marginTop: sizes[5],
    marginBottom: sizes[8],
  },
  body: {
    marginHorizontal: sizes[5],
  },
  bottomBlock: {
    paddingRight: sizes[5],
    paddingLeft: sizes[5],
    paddingBottom: sizes[5],
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
    marginVertical: sizes[10],
  },
  priceText: {
    fontFamily: getFontFamily('500'),
    fontSize: sizes[12],
  },
  bottomBlockText: {
    fontFamily: getFontFamily('500'),
    fontSize: sizes[9],
  },
});

export default SecondStepScreen;
