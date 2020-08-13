import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableWithoutFeedbackProps,
} from 'react-native';
import {
  ContainedTouchableProperties,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {sizes, useTheme} from '../../context/ThemeContext';

interface IMyButtonProps
  extends ContainedTouchableProperties,
    TouchableWithoutFeedbackProps {
  children?: any;
  isActive?: boolean;
  type?: 'filled' | 'default';
  styleText?: StyleProp<TextStyle>;
}
const MyButton = ({
  children,
  isActive = false,
  disabled = false,
  type = 'filled',
  style = {},
  styleText = {},
  ...props
}: IMyButtonProps) => {
  const {primary, border, text, background} = useTheme();

  let bg = '';
  let color = '';
  let borderColor = '';

  if (type === 'filled') {
    bg = primary;
    borderColor = primary;
    color = background;
  } else {
    if (isActive) {
      borderColor = primary;
      color = primary;
    } else {
      borderColor = text;
      color = text;
    }
    bg = background;
  }

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        {
          backgroundColor: bg,
          borderColor: borderColor,
        },
        style,
      ]}
      {...props}>
      <Text style={[styles.text, {color: color}, styleText]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderRadius: sizes[1],
    borderWidth: 1,
  },
  text: {
    textTransform: 'uppercase',
    fontSize: sizes[8],
    textAlign: 'center',
    paddingVertical: sizes[6],
  },
});

export default MyButton;
