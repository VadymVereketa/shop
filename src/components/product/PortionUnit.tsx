import React, {useState} from 'react';
import {IProduct} from '../../typings/FetchData';
import {useFormattingContext} from '../../context/FormattingContext';
import {useDispatch, useSelector} from 'react-redux';
import {actionsCart, selectorsCart} from '../../redux/cart/cartReducer';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import {StyleSheet, View} from 'react-native';
import MyText from '../controls/MyText';
import {sizes} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import CountInput from '../controls/CountInput';
import {useResponsiveWidth} from 'react-native-responsive-dimensions';
import MyButton from '../controls/MyButton';
import t from '../../utils/translate';
import {ITranslate} from '../../assets/translations/uk';
import {selectorsOrder} from '../../redux/order/orderReducer';

interface IPortionUnitProps {
  product: IProduct;
  addToCart: (count: number) => any;
  title: ITranslate;
  price: number;
  onOrder: () => any;
  available: boolean;
}

const PortionUnit = React.memo(
  ({
    product,
    price,
    addToCart,
    title,
    onOrder,
    available,
  }: IPortionUnitProps) => {
    const w = useResponsiveWidth(100);
    const isRepeatOrder = useSelector(selectorsOrder.isRepeatOrder);
    const {formatPrice} = useFormattingContext();
    const dispatch = useDispatch();
    const initValue = useSelector(selectorsCart.getCountProduct(product.id));
    const [count, setCount] = useState(initValue !== null ? +initValue : 1);
    const {garnish} = product;
    const onChange = (n) => {
      setCount(n);
      dispatch(
        actionsCart.changeCount({
          count: n,
          id: product.id,
        }),
      );
    };

    const handleSubmit = async () => {
      await addToCart(count);
    };

    const handleOrder = async () => {
      await handleSubmit();
      onOrder();
    };

    useDidUpdateEffect(() => {
      if (initValue !== null) setCount(+initValue);
    }, [initValue]);

    return (
      <View style={styles.con}>
        {garnish && <MyText style={styles.garnish}>{garnish}</MyText>}
        <View style={styles.viewCount}>
          <MyText style={[styles.price]}>{formatPrice(+price * count)}</MyText>
          <CountInput
            isWeightUnit={false}
            onChange={onChange}
            value={count}
            style={{
              maxWidth: w / 2,
            }}
          />
        </View>
        {product.ingredients && (
          <MyText style={styles.garnish}>{t('commonStorage')}</MyText>
        )}
        <MyText style={styles.ingredients}>{product.ingredients}</MyText>
        {!isRepeatOrder && (
          <MyButton
            disabled={!available}
            styleText={styles.btnText}
            style={styles.btnTop}
            onPress={handleOrder}>
            {t('btnOrderLong')}
          </MyButton>
        )}
        <MyButton
          disabled={!available}
          onPress={handleSubmit}
          style={styles.btnBot}
          styleText={styles.btnText}
          type={'default'}
          isActive>
          {t(title)}
        </MyButton>

        <MyText style={styles.garnish}>{t('commonEnergyValue')}</MyText>

        <MyText style={styles.energyValue}>{product.energyValue}</MyText>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  con: {
    marginTop: sizes[8],
  },
  garnish: {
    fontSize: sizes[9],
    fontFamily: getFontFamily('500'),
  },
  viewCount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    marginBottom: sizes[12],
  },
  price: {
    fontSize: sizes[15],
    fontFamily: getFontFamily('400'),
  },
  ingredients: {
    fontSize: sizes[9],
    marginBottom: sizes[15],
  },
  btnTop: {
    marginBottom: sizes[5],
  },
  btnBot: {
    marginBottom: sizes[15],
  },
  btnText: {
    fontSize: sizes[9],
  },
  energyValue: {
    fontSize: sizes[9],
    marginVertical: sizes[5],
  },
});
export default PortionUnit;
