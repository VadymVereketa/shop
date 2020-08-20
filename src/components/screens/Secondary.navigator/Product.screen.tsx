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
import {ScrollView} from 'react-native-gesture-handler';
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
import Animated from 'react-native-reanimated';

const window = Dimensions.get('window');

const ProductScreen = ({navigation, route}: ProductScreenProps) => {
  const offsetY = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const product = route.params.product;
  const insets = useSafeAreaInsets();
  const [isShow, setIsShow] = useState(false);
  const isAuth = useSelector(selectorsUser.isAuth);
  const w = useResponsiveWidth(100) - (insets.right + insets.left);
  const isProductInCart = useSelector(
    selectorsCart.checkProductInCart(product.id),
  );
  const {border} = useTheme();
  const {setLocale, currentLocale} = useFormattingContext();
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

  const addProductToCart = (
    count: number,
    alternativeCount: number | null = null,
  ) => {
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
      backgroundColor: 'white',
      bottom: 0,
      left: 0,
      right: 0,
    },
  };

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
            />
          ) : (
            <PortionUnit
              product={product}
              addToCart={addProductToCart}
              title={title}
              price={price}
            />
          )}
          <View style={[styles.border, {backgroundColor: border}]} />
          <ProductSlider idCategory={product.customCategory.id} />
        </View>
      </ScrollView>

      <BoxShadow setting={shadowOpt}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            paddingLeft: insets.left || sizes[5],
            paddingRight: insets.right || sizes[5],
            paddingBottom: insets.bottom + sizes[6],
          }}>
          <MyText style={styles.text}>Щоб додати до кошика увійдіть</MyText>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <MyButton
              containerStyle={{maxWidth: (w - sizes[20]) / 2}}
              styleText={styles.btn}
              type={'default'}
              isActive>
              Увiйдiть
            </MyButton>
            <MyButton
              containerStyle={{maxWidth: (w - sizes[20]) / 2}}
              styleText={styles.btn}
              type={'default'}>
              Реєстрація
            </MyButton>
          </View>
        </View>
      </BoxShadow>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  image: {
    height: Math.min(window.height, window.width) / 1.5,
    width: Math.min(window.height, window.width),
  },
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
});

export default ProductScreen;
