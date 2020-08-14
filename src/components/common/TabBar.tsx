import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import MyButton from './MyButton';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {selectorsCart} from '../../redux/cart/cartReducer';
import {useFormattingContext} from '../../context/FormattingContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useResponsiveWidth} from 'react-native-responsive-dimensions';
import {BoxShadow} from 'react-native-shadow';
import {
  BottomTabBarOptions,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs/lib/typescript/src/types';

const TabBar = (props: BottomTabBarProps<BottomTabBarOptions>) => {
  const sum = useSelector(selectorsCart.getGeneralSum);
  const {formatPrice} = useFormattingContext();
  const {lightText, darkText, background} = useTheme();
  const {bottom} = useSafeAreaInsets();
  const w = useResponsiveWidth(100);

  const shadowOpt = {
    width: w,
    height: 100,
    color: '#5c5c5c',
    border: 4,
    radius: 0,
    opacity: 0.2,
    x: 0,
    y: 0,
    style: {
      height: 0,
    },
  };

  const current = props.state.index;

  return (
    <View>
      <BoxShadow setting={shadowOpt} />
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
          const color = current === index ? darkText : lightText;
          if (r.name === 'Cart') {
            return (
              <MyButton
                ultraWidth={false}
                styleText={styles.cart}
                containerStyle={styles.cartCon}>
                {formatPrice(sum)}
              </MyButton>
            );
          } else {
            const Icon: any = description.tabBarIcon;
            return (
              <TouchableOpacity
                onPress={() => props.navigation.navigate(r.name)}
                style={styles.btn}
                containerStyle={styles.btn}>
                <Icon color={color} size={sizes[10]} />
                <Text style={[styles.textBtn, {color: color}]}>
                  {description.title}
                </Text>
              </TouchableOpacity>
            );
          }
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    flexDirection: 'row',
    paddingVertical: sizes[5],
  },
  cart: {
    fontSize: sizes[7],
    textTransform: 'lowercase',
  },
  cartCon: {
    marginHorizontal: sizes[5],
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  textBtn: {
    fontSize: sizes[5],
  },
});

export default TabBar;
