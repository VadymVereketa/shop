import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import MyButton from '../controls/MyButton';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {selectorsCart} from '../../redux/cart/cartReducer';
import {useFormattingContext} from '../../context/FormattingContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  BottomTabBarOptions,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import MyText from '../controls/MyText';
import {selectorsOrder} from '../../redux/order/orderReducer';
import {selectorsOther} from '../../redux/other/otherReducer';

const TabBar = React.memo((props: BottomTabBarProps<BottomTabBarOptions>) => {
  const sum = useSelector(selectorsCart.getGeneralSum);
  const {formatPrice} = useFormattingContext();
  const {lightText, darkText, background} = useTheme();
  const {bottom} = useSafeAreaInsets();
  const isRepeatOrder = useSelector(selectorsOrder.isRepeatOrder);
  const isGlobalSearch = useSelector(selectorsOther.getIsGlobalSearch);

  const current = props.state.index;

  return (
    <View
      style={[
        styles.con,
        {
          paddingBottom: bottom ? bottom : sizes[5],
          backgroundColor: background,
        },
      ]}>
      {props.state.routes.map((r, index) => {
        const description = props.descriptors[r.key].options;
        const color =
          current === index && !isGlobalSearch ? darkText : lightText;
        if (r.name === 'Cart') {
          if (isRepeatOrder) {
            return null;
          }
          return (
            <MyButton
              key={r.key}
              onPress={() => props.navigation.navigate(r.name)}
              ultraWidth={false}
              styleText={styles.cart}
              containerStyle={styles.cartCon}>
              {formatPrice(sum)}
            </MyButton>
          );
        } else {
          if (isRepeatOrder && r.name === 'Menu') return null;
          const Icon: any = description.tabBarIcon;
          return (
            <TouchableOpacity
              key={r.key}
              onPress={() => props.navigation.navigate(r.name)}
              style={styles.btn}
              containerStyle={styles.btn}>
              <Icon color={color} size={sizes[10]} />
              <MyText
                style={[styles.textBtn, {color: color}]}
                maxFontSizeMultiplier={1.1}>
                {description.title}
              </MyText>
            </TouchableOpacity>
          );
        }
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  con: {
    flexDirection: 'row',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {
      height: -2,
      width: 0,
    },
    elevation: 10,
    paddingTop: sizes[5],
  },
  cart: {
    fontSize: sizes[7],
    textTransform: 'lowercase',
  },
  cartCon: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: sizes[30],
    flexGrow: 1,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  textBtn: {
    fontSize: sizes[6],
  },
});

export default TabBar;
