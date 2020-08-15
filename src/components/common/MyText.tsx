import React from 'react';
import {TextProps, Text} from 'react-native';

interface IMyTextProps extends TextProps {
  children?: any;
}
const MyText = ({children, ...props}: IMyTextProps) => {
  return (
    <Text maxFontSizeMultiplier={1.3} minimumFontScale={1} {...props}>
      {children}
    </Text>
  );
};

export default MyText;
