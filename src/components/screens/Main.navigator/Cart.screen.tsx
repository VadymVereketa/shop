import React, {useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {selectorsCart} from '../../../redux/cart/cartReducer';
import MyText from '../../controls/MyText';
import t from '../../../utils/translate';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {getFontFamily} from '../../../utils/getFontFamily';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import CartItem from '../../common/CartItem';
import {useFormattingContext} from '../../../context/FormattingContext';
import MyButton from '../../controls/MyButton';

const CartScreen = () => {
  const {border} = useTheme();
  const {formatPrice} = useFormattingContext();
  const items = useSelector(selectorsCart.getCartProducts);
  const sum = useSelector(selectorsCart.getGeneralSum);

  return (
    <SafeAreaView style={[styles.container]}>
      <MyText style={[styles.text]}> {t('profileTitle')}</MyText>
      <View style={{height: 1, backgroundColor: border}} />
      {items.length > 0 ? (
        <React.Fragment>
          <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}>
            {items.map((item) => {
              return <CartItem key={item.product.id} item={item} />;
            })}
          </ScrollView>
          <View style={styles.sum}>
            <MyText style={styles.title}>Сума за замовлення:</MyText>
            <MyText style={styles.textPrice}>{formatPrice(sum)}</MyText>
          </View>
          <MyButton ultraWidth={true} styleText={{fontSize: sizes[9]}}>
            {t('btnOrderLong')}
          </MyButton>
        </React.Fragment>
      ) : (
        <View style={styles.emptyView}>
          <MyText style={styles.title}>Кошик порожній</MyText>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: sizes[5],
    justifyContent: 'space-between',
    flex: 1,
  },
  text: {
    textAlign: 'center',
    paddingVertical: sizes[5],
    fontSize: sizes[10],
    fontFamily: getFontFamily('500'),
  },
  title: {
    fontSize: sizes[9],
    fontFamily: getFontFamily('500'),
  },
  textPrice: {
    fontSize: sizes[12],
    fontFamily: getFontFamily('500'),
  },
  sum: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: sizes[10],
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CartScreen;
