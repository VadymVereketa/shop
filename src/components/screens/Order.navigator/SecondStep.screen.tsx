import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import PressTitle from '../../controls/PressTitle';
import MyText from '../../controls/MyText';
import {getFontFamily} from '../../../utils/getFontFamily';
import {sizes, useTheme} from '../../../context/ThemeContext';
import MyButton from '../../controls/MyButton';
import {useDispatch, useSelector} from 'react-redux';
import {selectorsCart} from '../../../redux/cart/cartReducer';
import {useFormattingContext} from '../../../context/FormattingContext';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import BlockDelivery from '../../common/BlockDelivery';
import Animated, {Easing, timing} from 'react-native-reanimated';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import CartItem from '../../common/CartItem';
import {SecondStepScreenProps} from '../../navigators/Order.navigator';
import {actionsOrder, selectorsOrder} from '../../../redux/order/orderReducer';
import MyTextInput from '../../controls/MyTextInput';
import {selectorsOther} from '../../../redux/other/otherReducer';
import {
  DEFAULT_NAME_SETTING,
  TypeDelivery,
} from '../../../constants/constantsId';
import getOptions from '../../../utils/getOptionsDate';
import {IOptionDate} from './Date.screen';

const h = sizes[100] + sizes[50];

const useGetOptionsDate = () => {
  const [options, setOptions] = useState([] as IOptionDate[]);
  const idSellPoint = useSelector(selectorsOrder.getSellPoint);
  const deliveryType = useSelector(selectorsOrder.getDeliveryType);
  const [name, setName] = useState(DEFAULT_NAME_SETTING);
  const settings = useSelector(selectorsOther.getSetting(name));

  useEffect(() => {
    if (deliveryType === null) {
      setOptions([]);
    } else if (deliveryType.code === TypeDelivery.courier) {
      setOptions(getOptions(settings, true));
    } else if (idSellPoint === null) {
      setOptions([]);
    } else {
      setOptions(getOptions(settings));
    }
  }, [deliveryType, idSellPoint]);

  return options;
};

const SecondStepScreen = React.memo(
  ({navigation, route}: SecondStepScreenProps) => {
    const params = route.params || {};
    const paramAddressId = params.idAddress;
    const paramOption = params.option;
    const offsetY = useRef(new Animated.Value(-h)).current;
    const dispatch = useDispatch();
    const [isShow, setIsShow] = useState(false);
    const options = useGetOptionsDate();
    const insets = useSafeAreaInsets();
    const sum = useSelector(selectorsCart.getGeneralSum);
    const items = useSelector(selectorsCart.getCartProducts);
    const date = useSelector(selectorsOrder.getDate);
    const time = useSelector(selectorsOrder.getTime);
    const {border, lightBackground, background, text} = useTheme();
    const {formatPrice, formatDate} = useFormattingContext();

    const handleToggle = () => {
      setIsShow((s) => !s);
    };

    const handlePressDate = useCallback(() => {
      console.log(options);
      navigation.push('Date', {
        options,
      });
    }, [options]);

    useDidUpdateEffect(() => {
      dispatch(
        actionsOrder.setData({
          addressId: paramAddressId,
        }),
      );
    }, [paramAddressId]);

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
          <PressTitle
            expand
            style={[styles.order, {backgroundColor: lightBackground}]}
            onPress={handleToggle}>
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
            {options.length > 0 && (
              <React.Fragment>
                <MyText style={styles.text}>Дата та час доставки</MyText>
                <MyTextInput
                  editable={false}
                  viewOnTouch={handlePressDate}
                  afterIcon={{
                    onPress: () => null,
                    name: 'next',
                  }}
                  value={`${date ? formatDate(date) : ''} ${time}`}
                />
              </React.Fragment>
            )}
          </Animated.View>
        </ScrollView>
        <View
          style={[
            styles.bottomBlock,
            {
              backgroundColor: background,
              paddingBottom: insets.bottom || sizes[5],
              paddingLeft: insets.left || sizes[5],
              paddingRight: insets.right || sizes[5],
              marginLeft: -insets.left,
              marginRight: -insets.right,
              shadowColor: text,
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
  },
);

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
    paddingBottom: sizes[10],
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
