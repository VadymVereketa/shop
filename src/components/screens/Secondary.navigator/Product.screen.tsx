import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  PixelRatio,
} from 'react-native';
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
  TouchableOpacity,
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
import t from '../../../utils/translate';
import DesignIcon from '../../common/DesignIcon';
import LoginButton from '../../common/LoginButton';
import useAvailableProduct from '../../../useHooks/useAvailableProduct';
import {
  getCDNKeyBySize,
  ICDNVariantKey,
  productImage,
} from '../../../typings/ICDNImage';

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
  const {
    border,
    text,
    background,
    primary,
    theme,
    lightBackground,
  } = useTheme();
  const ID_SELL_POINT = useSelector(selectorsOther.getIdSellPoint);
  const index = getIndexProductOption(product, ID_SELL_POINT);
  const price =
    product.productOptions.length > 0
      ? +product.productOptions[index].price
      : 0;
  let available = useAvailableProduct()(product);
  const isWeightUnit =
    product.unit && product.unit.externalId === ID_UNIT_WEIGHT;

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
          services: [],
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
          source={productImage(product, ICDNVariantKey['1200x900'])}
          resizeMode={'cover'}
          style={{
            width: w,
            height: w / 2,
          }}
        />
        <View style={styles.body}>
          <MyText style={[styles.title]}>{product.shortDescription}</MyText>
          {isWeightUnit ? (
            <WeightUnit
              price={price}
              title={title}
              id={product.id}
              avgWeight={product.avgWeight}
              addToCart={addProductToCart}
              onOrder={handleOrder}
              product={product}
              available={available}
            />
          ) : (
            <PortionUnit
              product={product}
              addToCart={addProductToCart}
              title={title}
              price={price}
              onOrder={handleOrder}
              available={available}
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
              backgroundColor: theme === 'dark' ? lightBackground : text,
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
            backgroundColor: background,
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
          <View
            style={{
              paddingLeft: insets.left || sizes[5],
              paddingRight: insets.right || sizes[5],
              paddingBottom: (insets.bottom + sizes[10]) * 1,
              backgroundColor: background,
            }}>
            <MyText style={styles.text}>{t('commonNeedAuth')}</MyText>
            <LoginButton />
          </View>
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
