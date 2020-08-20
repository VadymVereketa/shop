import React, {useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ICartItem} from '../../typings/FetchData';
import {useDispatch, useSelector} from 'react-redux';
import {selectorsOrder} from '../../redux/order/orderReducer';
import {actionsCart, selectorsCart} from '../../redux/cart/cartReducer';
import {useFormattingContext} from '../../context/FormattingContext';
import {getIndexProductOption} from '../../utils/getIndexProductOption';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import IconButton from '../controls/IconButton';
import {sizes, useTheme} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import MyText from '../controls/MyText';
import CartCountItem from '../controls/CartCountInput';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import DesignIcon from './DesignIcon';
import getUrlImg from '../../utils/getUrlImg';
import Animated, {timing, Easing} from 'react-native-reanimated';
import t from '../../utils/translate';
import {CartScreenNavigationProp} from '../navigators/Cart.navigator';
import {ID_UNIT_WEIGHT} from '../../constants/constantsId';

interface ICartItemProps {
  item: ICartItem;
  defaultSellPoint?: number;
  isEdit?: boolean;
}

const CartItem = ({defaultSellPoint, item, isEdit = true}: ICartItemProps) => {
  const navigation = useNavigation<any>();
  const offsetY = useRef(new Animated.Value(0)).current;
  const {width} = Dimensions.get('window');
  const [willRemove, setWillRemove] = useState(false);
  const dispatch = useDispatch();
  const {text, border, background} = useTheme();
  const step = useSelector(selectorsOrder.getStep);
  const idSellPoint = useSelector(selectorsCart.getIdSellPoint);
  const {formatPrice, formatUnit} = useFormattingContext();
  const {product} = item;
  const isWeightUnit = product.units === ID_UNIT_WEIGHT;

  const removeItem = () => {
    setWillRemove(true);
    timing(offsetY, {
      toValue: -width,
      duration: 400,
      easing: Easing.ease,
    }).start(() => {
      dispatch(actionsCart.removeProduct(+product.id));
    });
  };

  const handleBlur = (value: string) => {
    dispatch(
      actionsCart.setComment({
        id: product.id,
        comment: value,
      }),
    );
  };
  const index = getIndexProductOption(
    item.product,
    defaultSellPoint || idSellPoint,
  );
  const price = +item.product.productOptions[index].price;
  const quantityPrice = price * +item.count;
  const imgId =
    item.product.productImages.length > 0
      ? item.product.productImages[0].uuid
      : null;

  return (
    <Animated.View
      style={[
        styles.con,
        {
          borderBottomColor: border,
          backgroundColor: background,
          zIndex: willRemove ? -10 : 0,
          left: offsetY,
        },
      ]}>
      {isEdit && (
        <IconButton
          onPress={removeItem}
          icon={{
            name: 'close',
            size: sizes[10],
            fill: text,
          }}
          style={[styles.iconRemove, {borderColor: border}]}
        />
      )}
      <View style={{flexGrow: 1}}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={getUrlImg(imgId)}
            resizeMode={'cover'}
            style={{
              width: sizes[37],
              height: sizes[25],
            }}
          />
          <MyText style={styles.title}>{product.title}</MyText>
        </View>
        <View style={styles.viewPrice}>
          {isEdit ? (
            <CartCountItem item={item} />
          ) : (
            <MyText style={styles.textPrice}>
              {formatUnit(item.count, product.units)}
            </MyText>
          )}
          <MyText style={styles.textPrice}>{formatPrice(quantityPrice)}</MyText>
        </View>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() =>
            navigation.navigate('SecondaryNavigator', {
              screen: 'CommentCart',
              params: {
                item,
              },
            })
          }>
          {isEdit &&
            (item.comment === '' ? (
              <React.Fragment>
                <DesignIcon
                  name={'comment'}
                  size={sizes[10]}
                  fill={border}
                  stroke={border}
                />
                <MyText style={[styles.titleComment, {marginLeft: sizes[7]}]}>
                  {t('cartAddComment')}
                </MyText>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <MyText style={styles.titleComment}>{t('cartComment')}:</MyText>
                <MyText>{item.comment}</MyText>
              </React.Fragment>
            ))}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  con: {
    flexDirection: 'row',
    paddingVertical: sizes[7],
    borderBottomWidth: 1,
  },
  iconRemove: {
    borderWidth: StyleSheet.hairlineWidth,
    flex: 0,
    marginRight: sizes[8],
    padding: sizes[5],
  },
  title: {
    fontSize: sizes[9],
    fontFamily: getFontFamily('500'),
    marginLeft: sizes[5],
    maxWidth: '60%',
  },
  viewPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: sizes[5],
    marginBottom: sizes[10],
  },
  textPrice: {
    fontSize: sizes[12],
    fontFamily: getFontFamily('500'),
  },
  titleComment: {
    fontSize: sizes[8],
    fontFamily: getFontFamily('500'),
  },
});
export default CartItem;
