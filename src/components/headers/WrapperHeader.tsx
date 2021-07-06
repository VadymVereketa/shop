import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {sizes, useTheme} from '../../context/ThemeContext';

interface IWrapperHeaderProps {
  children?: any;
  style?: StyleProp<ViewStyle>;
}

const WrapperHeader = ({children, style}: IWrapperHeaderProps) => {
  const {background} = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.con,
        {
          backgroundColor: background,
          paddingTop: insets.top || sizes[5],
        },
        style,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    paddingHorizontal: sizes[5],
    paddingVertical: sizes[7],
    flexDirection: 'row',
    alignItems: 'center',

    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowColor: 'rgb(60, 65, 98)',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 2,
  },
});

export default WrapperHeader;
