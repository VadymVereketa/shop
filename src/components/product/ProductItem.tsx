import {IImgProduct, IProduct} from '../../typings/FetchData';
import {useResponsiveWidth} from 'react-native-responsive-dimensions';
import React, {useState} from 'react';
import {useFormattingContext} from '../../context/FormattingContext';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {selectorsOther} from '../../redux/other/otherReducer';
import {getIndexProductOption} from '../../utils/getIndexProductOption';
import {sizes, useTheme} from '../../context/ThemeContext';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import getUrlImg from '../../utils/getUrlImg';
import {getFontFamily} from '../../utils/getFontFamily';
import MyButton from '../controls/MyButton';
import {BoxShadow} from 'react-native-shadow';
import MyText from '../controls/MyText';
import {ProductScreenNavigationProp} from '../navigators/Secondary.navigator';
import t from '../../utils/translate';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {actionsCart, selectorsCart} from '../../redux/cart/cartReducer';
import {selectorsUser} from '../../redux/user/userReducer';
import CartCountItem from '../controls/CartCountInput';
import {ID_UNIT_WEIGHT} from '../../constants/constantsId';

const window = Dimensions.get('window');

interface IProductItemProps {
  product: IProduct;
}

const borderRadius = sizes[1];

const ProductItem = React.memo(({product}: IProductItemProps) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<ProductScreenNavigationProp>();
  const isAuth = useSelector(selectorsUser.isAuth);
  const initValue = useSelector(selectorsCart.getCountProduct(product.id)) || 1;
  const productCart = useSelector(selectorsCart.getCartProduct(product.id));
  const alternativeCount = useSelector(
    selectorsCart.getAlternativeCountProduct(product.id),
  );
  const {background, text, lightBackground, theme} = useTheme();
  const {formatPrice} = useFormattingContext();
  const ID_SELL_POINT = useSelector(selectorsOther.getIdSellPoint);
  const isWeightUnit =
    product.unit && product.unit.externalId === ID_UNIT_WEIGHT;
  const index = getIndexProductOption(product, ID_SELL_POINT);
  const price =
    product.productOptions.length > 0
      ? +product.productOptions[index].price
      : 0;
  let available = price !== 0;
  const productImage: IImgProduct =
    (product.productImages && product.productImages[0]) || {};

  const isAvgWeight = isWeightUnit && !!product.avgWeight;
  const handlePress = () => {
    navigation.push('SecondaryNavigator', {
      screen: 'Product',
      params: {
        id: product.id,
        product,
      },
    });
  };

  const handleOrder = () => {
    if (!isAuth) {
      handlePress();
      return;
    }
    if (available) {
      dispatch(
        actionsCart.addProduct({
          comment: '',
          count: isAvgWeight ? +product.avgWeight! : 1,
          product: product,
          alternativeCount: isAvgWeight ? 1 : null,
        }),
      );
    }
  };

  const Price =
    alternativeCount === null
      ? formatPrice(+price * initValue)
      : formatPrice(+price * initValue * +product.avgWeight!);
  return (
    <View
      style={[
        styles.con,
        {
          shadowColor: text,
        },
      ]}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <Image
          source={getUrlImg(productImage.uuid)}
          resizeMode={'cover'}
          style={styles.image}
        />
      </TouchableWithoutFeedback>
      <View
        style={[
          styles.content,
          {backgroundColor: theme === 'dark' ? lightBackground : background},
        ]}>
        <MyText style={styles.title}>{product.title}</MyText>
        <View>
          <MyText style={styles.price}>{Price}</MyText>
          {productCart ? (
            theme === 'dark' ? (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#01A6E6',
                  borderRadius: sizes[1],
                }}>
                <CartCountItem item={productCart} />
              </View>
            ) : (
              <CartCountItem item={productCart} />
            )
          ) : (
            <MyButton
              ultraWidth={true}
              styleText={styles.btnText}
              onPress={handleOrder}>
              {t('btnOrder')}
            </MyButton>
          )}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  con: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    borderRadius: 3,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 2,
  },
  image: {
    height: (Math.min(window.height, window.width) * 25) / 100,
    width: '100%',
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
  },
  content: {
    paddingHorizontal: sizes[5],
    paddingVertical: sizes[6],
    borderBottomEndRadius: borderRadius,
    borderBottomLeftRadius: borderRadius,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: sizes[8],
    fontFamily: getFontFamily('500'),
    textTransform: 'capitalize',
  },
  price: {
    fontSize: sizes[9],
    paddingVertical: sizes[6],
    fontFamily: getFontFamily('500'),
  },
  btnText: {fontSize: sizes[9]},
});

export default ProductItem;
