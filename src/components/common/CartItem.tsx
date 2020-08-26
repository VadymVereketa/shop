import React, {useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ICartItem, IPurchase} from '../../typings/FetchData';
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
import {ID_UNIT_WEIGHT} from '../../constants/constantsId';

interface ICartItemProps {
  item: ICartItem;
  defaultSellPoint?: number;
  isEdit?: boolean;
}

const CartItem = React.memo(
  ({defaultSellPoint, item, isEdit = true}: ICartItemProps) => {
    const step = useSelector(selectorsOrder.getStep);
    const idSellPoint = useSelector(selectorsCart.getIdSellPoint);
    const {product} = item;
    const isWeightUnit = product.units === ID_UNIT_WEIGHT;

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
      <ViewProductItem
        id={product.id}
        imgId={imgId}
        isEdit={isEdit}
        item={item}
        title={product.title}
        price={quantityPrice}
        count={+item.count}
        units={product.units}
        comment={item.comment}
      />
    );
  },
);

interface IPurchaseItemProps {
  item: IPurchase;
}

const PurchaseItem = React.memo(({item}: IPurchaseItemProps) => {
  const {product} = item;

  const quantityPrice = +item.price * +item.count;
  const imgId =
    item.product.productImages.length > 0
      ? item.product.productImages[0].uuid
      : null;

  return (
    <ViewProductItem
      id={product.id}
      imgId={imgId}
      isEdit={false}
      item={null as any}
      title={product.title}
      price={quantityPrice}
      count={+item.count}
      units={product.units}
      comment={item.comment}
    />
  );
});

interface IViewProductItemProps {
  id: number;
  isEdit?: boolean;
  item?: ICartItem;
  imgId: any;
  title: string;
  count: number;
  price: number;
  units: any;
  comment: string;
}
const ViewProductItem = React.memo(
  ({
    comment,
    count,
    id,
    imgId,
    isEdit,
    price,
    title,
    units,
    item,
  }: IViewProductItemProps) => {
    const {width} = Dimensions.get('window');
    const [willRemove, setWillRemove] = useState(false);
    const dispatch = useDispatch();
    const offsetY = useRef(new Animated.Value(0)).current;
    const {formatPrice, formatUnit} = useFormattingContext();
    const navigation = useNavigation<any>();
    const {text, border, background} = useTheme();

    const removeItem = () => {
      setWillRemove(true);
      timing(offsetY, {
        toValue: -width,
        duration: 400,
        easing: Easing.ease,
      }).start(() => {
        dispatch(actionsCart.removeProduct(id));
      });
    };

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
            <MyText style={styles.title}>{title}</MyText>
          </View>
          <View style={styles.viewPrice}>
            {isEdit ? (
              <CartCountItem item={item!} />
            ) : (
              <MyText style={{fontFamily: getFontFamily('500')}}>
                {formatUnit(count, units)}
              </MyText>
            )}
            <MyText style={styles.textPrice}>{formatPrice(price)}</MyText>
          </View>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => {
              navigation.navigate('SecondaryNavigator', {
                screen: 'CommentCart',
                params: {
                  item,
                },
              });
            }}>
            {isEdit ? (
              comment === '' ? (
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
                  <MyText style={styles.titleComment}>
                    {t('cartComment')}:
                  </MyText>
                  <MyText>{comment}</MyText>
                </React.Fragment>
              )
            ) : (
              comment && (
                <React.Fragment>
                  <MyText style={styles.titleComment}>
                    {t('cartComment')}:
                  </MyText>
                  <MyText>{comment}</MyText>
                </React.Fragment>
              )
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  },
);

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
    marginBottom: sizes[5],
  },
  textPrice: {
    fontSize: sizes[9],
    fontFamily: getFontFamily('500'),
  },
  titleComment: {
    fontSize: sizes[8],
    fontFamily: getFontFamily('500'),
  },
});
export {PurchaseItem};
export default CartItem;
