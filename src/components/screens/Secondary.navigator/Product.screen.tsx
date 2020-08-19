import React, {useState} from 'react';
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
import {
  responsiveHeight,
  responsiveWidth,
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

const window = Dimensions.get('window');

const ProductScreen = ({navigation, route}: ProductScreenProps) => {
  const dispatch = useDispatch();
  const product = route.params.product;
  const insets = useSafeAreaInsets();
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

  return (
    <ScrollView
      style={[
        styles.container,
        {
          paddingLeft: insets.left,
          paddingRight: insets.right,
          marginBottom: insets.bottom,
        },
      ]}>
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
});

export default ProductScreen;
