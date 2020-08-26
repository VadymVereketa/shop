import {IImgProduct, IProduct} from '../../typings/FetchData';
import {useResponsiveWidth} from 'react-native-responsive-dimensions';
import React, {useState} from 'react';
import {useFormattingContext} from '../../context/FormattingContext';
import {useSelector} from 'react-redux';
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

const window = Dimensions.get('window');

interface IProductItemProps {
  product: IProduct;
}

const borderRadius = sizes[1];

const ProductItem = React.memo(({product}: IProductItemProps) => {
  const navigation = useNavigation<ProductScreenNavigationProp>();
  const {background, text, lightBackground, theme} = useTheme();
  const {formatPrice} = useFormattingContext();
  const ID_SELL_POINT = useSelector(selectorsOther.getIdSellPoint);
  const index = getIndexProductOption(product, ID_SELL_POINT);
  const price =
    product.productOptions.length > 0
      ? +product.productOptions[index].price
      : 0;
  let available = price !== 0;
  const productImage: IImgProduct =
    (product.productImages && product.productImages[0]) || {};

  const handlePress = () => {
    navigation.push('SecondaryNavigator', {
      screen: 'Product',
      params: {
        id: product.id,
        product,
      },
    });
  };

  return (
    <View
      style={[
        styles.con,
        {
          shadowColor: text,
        },
      ]}>
      <Image
        source={getUrlImg(productImage.uuid)}
        resizeMode={'cover'}
        style={styles.image}
      />
      <View
        style={[
          styles.content,
          {backgroundColor: theme === 'dark' ? lightBackground : background},
        ]}>
        <MyText style={styles.title}>{product.title}</MyText>
        <View>
          <MyText style={styles.price}>{formatPrice(price)}</MyText>
          <MyButton
            ultraWidth={true}
            styleText={styles.btnText}
            onPress={handlePress}>
            {t('btnOrder')}
          </MyButton>
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
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
