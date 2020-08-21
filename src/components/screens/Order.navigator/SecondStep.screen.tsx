import React from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import PressTitle from '../../controls/PressTitle';
import MyText from '../../controls/MyText';
import {getFontFamily} from '../../../utils/getFontFamily';
import {sizes} from '../../../context/ThemeContext';
import MyButton from '../../controls/MyButton';
import {useSelector} from 'react-redux';
import {selectorsCart} from '../../../redux/cart/cartReducer';
import {useFormattingContext} from '../../../context/FormattingContext';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {BoxShadow} from 'react-native-shadow';
import {useResponsiveWidth} from 'react-native-responsive-dimensions';
import BlockDelivery from '../../common/BlockDelivery';
import {selectorsOther} from '../../../redux/other/otherReducer';
import {selectorsTypes} from '../../../redux/types/typeReducer';
import {TypeDelivery} from '../../../constants/constantsId';

const window = Dimensions.get('window');

const SecondStepScreen = (props: any) => {
  const insets = useSafeAreaInsets();
  const w = useResponsiveWidth(100);
  const sum = useSelector(selectorsCart.getGeneralSum);
  const {formatPrice} = useFormattingContext();

  const shadowOpt = {
    width: Math.max(window.width, window.height) + (insets.left + insets.right),
    height: sizes[65],
    color: '#a0a0a0',
    border: 5,
    radius: 0,
    opacity: 0.2,
    x: 0,
    y: 0,
    style: {
      backgroundColor: 'white',
      marginRight: -insets.right,
      marginLeft: -insets.left,
      maxWidth: '100%',
    },
  };

  return (
    <SafeAreaView style={[styles.container, {marginTop: -insets.top}]}>
      <ScrollView>
        <PressTitle expand style={styles.order}>
          Замовлення
        </PressTitle>
        <View style={styles.body}>
          <MyText style={styles.text}>Оберіть спосіб отримання</MyText>
          <BlockDelivery />
        </View>
      </ScrollView>
      <BoxShadow setting={shadowOpt}>
        <View
          style={{
            backgroundColor: 'white',
            paddingBottom: sizes[20],
            paddingRight: insets.right || sizes[5],
            paddingLeft: insets.left || sizes[5],

            width: w,
          }}>
          <View style={styles.price}>
            <MyText style={styles.bottomBlockText}>Сума за замовлення</MyText>
            <MyText style={styles.priceText}>{formatPrice(sum)}</MyText>
          </View>
          <MyButton styleText={styles.btn}>продовжити</MyButton>
        </View>
      </BoxShadow>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  order: {
    backgroundColor: '#f9f9f9',
  },
  text: {
    fontFamily: getFontFamily('500'),
    marginTop: sizes[5],
    marginBottom: sizes[8],
  },
  body: {
    marginHorizontal: sizes[5],
  },
  bottomBlock: {},
  btn: {
    fontSize: sizes[9],
  },
  price: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: sizes[10],
  },
  priceText: {
    fontFamily: getFontFamily('500'),
    fontSize: sizes[12],
  },
  bottomBlockText: {
    fontFamily: getFontFamily('500'),
    fontSize: sizes[9],
  },
});

export default SecondStepScreen;
