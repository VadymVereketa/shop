import React from 'react';
import {TextProps, Text, StyleSheet} from 'react-native';
import {getFontFamily} from '../../utils/getFontFamily';
import {sizes} from '../../context/ThemeContext';

interface IMyTextProps extends TextProps {
  children?: any;
}
const MyText = ({children, style = {}, ...props}: IMyTextProps) => {
  return (
    <Text
      maxFontSizeMultiplier={1.3}
      minimumFontScale={1}
      style={[styles.text, style]}
      {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: sizes[8],
    fontFamily: getFontFamily('300'),
  },
});

export default MyText;
