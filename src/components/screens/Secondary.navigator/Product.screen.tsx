import React, {useRef, useState} from 'react';
import {View, StyleSheet, Text, Image, Dimensions} from 'react-native';
import {ProductScreenProps} from '../../navigators/Secondary.navigator';
import CountInput from '../../controls/CountInput';
import I18n from 'react-native-i18n';
import MyText from '../../controls/MyText';
import {useFormattingContext} from '../../../context/FormattingContext';
import {Slider} from '@miblanchard/react-native-slider';
import {sizes, useTheme} from '../../../context/ThemeContext';
import WeightUnit from '../../product/WeightUnit';
import getUrlImg from '../../../utils/getUrlImg';
import {IImgProduct} from '../../../typings/FetchData';
import {getFontFamily} from '../../../utils/getFontFamily';
import {BoxShadow} from 'react-native-shadow';
import {
  responsiveScreenWidth,
  useResponsiveWidth,
} from 'react-native-responsive-dimensions';
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {selectorsOther} from '../../../redux/other/otherReducer';
import {getIndexProductOption} from '../../../utils/getIndexProductOption';
import {ID_UNIT_WEIGHT} from '../../../constants/constantsId';
import {actionsCart, selectorsCart} from '../../../redux/cart/cartReducer';
import PortionUnit from '../../product/PortionUnit';
import ProductSlider from '../../product/ProductSlider';
import {ITranslate} from '../../../assets/translations/uk';
import {selectorsUser} from '../../../redux/user/userReducer';
import MyButton from '../../controls/MyButton';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  timing,
} from 'react-native-reanimated';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';

const ProductScreen = React.memo(({navigation, route}: ProductScreenProps) => {
  const window = Dimensions.get('window');
  const offsetY = useRef(new Animated.Value(200)).current;

  const dispatch = useDispatch();
  const product = route.params.product;
  const insets = useSafeAreaInsets();
  const [isShow, setIsShow] = useState(false);
  const isAuth = useSelector(selectorsUser.isAuth);
  const w = useResponsiveWidth(100) - (insets.right + insets.left);
  const isProductInCart = useSelector(
    selectorsCart.checkProductInCart(product.id),
  );
  const {border, text} = useTheme();
  const ID_SELL_POINT = useSelector(selectorsOther.getIdSellPoint);
  const index = getIndexProductOption(product, ID_SELL_POINT);
  const price =
    product.productOptions.length > 0
      ? +product.productOptions[index].price
      : 0;
  let available = price !== 0;
  const isWeightUnit =
    product.unit && product.unit.externalId === ID_UNIT_WEIGHT;
  const productImage: IImgProduct =
    (product.productImages && product.productImages[0]) || {};
  const title: ITranslate = isProductInCart ? 'btnHasInCart' : 'btnAddToCart';

  const addProductToCart = async (
    count: number,
    alternativeCount: number | null = null,
  ) => {
    if (!isAuth) {
      setIsShow(true);
      return;
    }
    if (!isProductInCart) {
      dispatch(
        actionsCart.addProduct({
          count: count,
          comment: '',
          product: product!,
          alternativeCount,
        }),
      );
    }
    dispatch(actionsCart.toggleCart(true));
  };

  const handleOrder = () => {
    if (!isAuth) {
      setIsShow(true);
      return;
    }
    navigation.replace('OrderNavigator', {});
  };

  useDidUpdateEffect(() => {
    timing(offsetY, {
      toValue: isShow ? 0 : 200,
      duration: 300,
      easing: Easing.ease,
    }).start();
  }, [isShow]);

  const shadowOpt = {
    width: w + (insets.right + insets.left),
    height: sizes[65] + insets.bottom,
    color: '#a0a0a0',
    border: 40,
    radius: 0,
    opacity: 0.3,
    x: 0,
    y: -1,
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
  };

  const translateY = interpolate(offsetY, {
    inputRange: [0, 200],
    outputRange: [0, window.height],
    extrapolate: Extrapolate.CLAMP,
  });

  return (
    <View
      style={{
        paddingLeft: insets.left,
        paddingRight: insets.right,
        paddingBottom: insets.bottom,
      }}>
      <ScrollView style={[styles.container]}>
        <Image
          source={getUrlImg(productImage.uuid)}
          resizeMode={'cover'}
          style={{
            width: w,
            height: w / 2,
          }}
        />
        <View style={styles.body}>
          <MyText style={[styles.title]}>{product.title}</MyText>
          {isWeightUnit ? (
            <WeightUnit
              price={price}
              title={title}
              id={product.id}
              avgWeight={product.avgWeight}
              addToCart={addProductToCart}
              onOrder={handleOrder}
            />
          ) : (
            <PortionUnit
              product={product}
              addToCart={addProductToCart}
              title={title}
              price={price}
              onOrder={handleOrder}
            />
          )}
          <View style={[styles.border, {backgroundColor: border}]} />
          <ProductSlider idCategory={product.customCategory.id} />
        </View>
      </ScrollView>
      {!isAuth && (
        <Animated.View
          style={[
            styles.back,
            {
              backgroundColor: text,
              height: window.height,
              transform: [
                {
                  translateY,
                },
              ],
            },
          ]}>
          <TouchableWithoutFeedback
            containerStyle={styles.backTouch}
            onPress={() => setIsShow(false)}
          />
        </Animated.View>
      )}
      {!isAuth && (
        <Animated.View
          style={{
            backgroundColor: 'white',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
            transform: [
              {
                translateY: offsetY,
              },
            ],
          }}>
          <BoxShadow setting={shadowOpt}>
            <View
              style={{
                paddingLeft: insets.left || sizes[5],
                paddingRight: insets.right || sizes[5],
                paddingBottom: (insets.bottom + sizes[10]) * 1,
                backgroundColor: 'white',
              }}>
              <MyText style={styles.text}>Щоб додати до кошика увійдіть</MyText>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: 'white',
                }}>
                <MyButton
                  containerStyle={{maxWidth: (w - sizes[20]) / 2}}
                  styleText={styles.btn}
                  type={'default'}
                  onPress={() =>
                    navigation.push('AuthNavigator', {
                      screen: 'Login',
                    })
                  }
                  isActive>
                  Увiйдiть
                </MyButton>
                <MyButton
                  containerStyle={{maxWidth: (w - sizes[20]) / 2}}
                  styleText={styles.btn}
                  onPress={() =>
                    navigation.push('AuthNavigator', {
                      screen: 'SignUp',
                    })
                  }
                  type={'default'}>
                  Реєстрація
                </MyButton>
              </View>
            </View>
          </BoxShadow>
        </Animated.View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {},
  body: {
    marginHorizontal: sizes[5],
    marginTop: sizes[5],
  },
  title: {
    fontSize: sizes[12],
    fontFamily: getFontFamily('500'),
  },
  border: {
    height: 1,
    marginBottom: sizes[10],
    marginTop: sizes[6],
  },
  text: {
    fontSize: sizes[9],
    fontFamily: getFontFamily('500'),
    paddingVertical: sizes[11],
    backgroundColor: 'white',
  },
  btn: {
    fontSize: sizes[10],
  },
  back: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    opacity: 0.8,
    zIndex: 100,
  },
  backTouch: {
    flex: 1,
  },
});

export default ProductScreen;
