import {IImgProduct, IProduct} from '../../typings/FetchData';
import {useResponsiveWidth} from 'react-native-responsive-dimensions';
import React, {useState} from 'react';
import {useFormattingContext} from '../../context/FormattingContext';
import {useSelector} from 'react-redux';
import {selectorsOther} from '../../redux/other/otherReducer';
import {getIndexProductOption} from '../../utils/getIndexProductOption';
import {sizes, useTheme} from '../../context/ThemeContext';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import getUrlImg from '../../utils/getUrlImg';
import {getFontFamily} from '../../utils/getFontFamily';
import MyButton from './MyButton';
import {BoxShadow} from 'react-native-shadow';
import MyText from './MyText';

const window = Dimensions.get('window');

interface IProductItemProps {
  product: IProduct;
}

const borderRadius = sizes[1];

const ProductItem = ({product}: IProductItemProps) => {
  const w = useResponsiveWidth(100);
  const {background} = useTheme();
  const [layout, setLayout] = useState({height: 100, width: w});
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

  const shadowOpt = {
    width: layout.width,
    height: layout.height,
    color: '#a0a0a0',
    border: 3,
    radius: borderRadius,
    opacity: 0.1,
    x: 0,
    y: 1,
    style: {
      position: 'absolute',
    },
  };

  return (
    <View onLayout={(e) => setLayout(e.nativeEvent.layout)} style={styles.con}>
      <BoxShadow setting={shadowOpt} />
      <Image
        source={getUrlImg(productImage.uuid)}
        resizeMode={'cover'}
        style={styles.image}
      />
      <View style={[styles.content, {backgroundColor: background}]}>
        <MyText style={styles.title}>{product.title}</MyText>
        <View>
          <MyText style={styles.price}>{formatPrice(price)}</MyText>
          <MyButton ultraWidth={true} styleText={styles.btnText}>
            замовити
          </MyButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
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
