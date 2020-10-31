import React, {useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {selectorsCart} from '../../../redux/cart/cartReducer';
import MyText from '../../controls/MyText';
import t from '../../../utils/translate';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {getFontFamily} from '../../../utils/getFontFamily';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import CartItem from '../../common/CartItem';
import {useFormattingContext} from '../../../context/FormattingContext';
import MyButton from '../../controls/MyButton';
import BetaTest from '../../common/BetaTest';

const CartScreen = React.memo(({navigation}: any) => {
  const insets = useSafeAreaInsets();
  const {border, primary} = useTheme();
  const {formatPrice} = useFormattingContext();
  const items = useSelector(selectorsCart.getCartProducts);
  const sum = useSelector(selectorsCart.getGeneralSum);

  const handleOrder = () => {
    navigation.push('OrderNavigator', {
      screen: 'FirstStep',
    });
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}>
      <MyText style={[styles.text]}> {t('cartTitle')}</MyText>
      <View style={{height: 1, backgroundColor: border}} />
      <BetaTest />
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
            <MyText style={styles.title}> {t('cartSum')}:</MyText>
            <MyText style={styles.textPrice}>{formatPrice(sum)}</MyText>
          </View>
          <MyButton
            ultraWidth={true}
            styleText={{fontSize: sizes[9]}}
            onPress={handleOrder}>
            {t('btnOrderLong')}
          </MyButton>
        </React.Fragment>
      ) : (
        <View style={styles.emptyView}>
          <MyText style={styles.title}> {t('cartEmptyItems')}</MyText>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginHorizontal: sizes[5],
    marginBottom: sizes[5],
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
