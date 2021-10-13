import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';

interface IBackgroundBlockProps {
  children?: any;
  style?: StyleProp<ViewStyle>;
}
const BackgroundBlock = ({children, style}: IBackgroundBlockProps) => {
  const {border2, background2} = useTheme();
  return (
    <View
      style={[
        styles.con,
        {
          borderColor: border2,
          backgroundColor: background2,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    borderWidth: 1,
    borderRadius: sizes[2],
    paddingHorizontal: sizes[8],
    paddingVertical: sizes[10],
  },
});
export default BackgroundBlock;
