import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import {
  ContainedTouchableProperties,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {sizes, useTheme} from '../../context/ThemeContext';
import MyText from './MyText';
import withPreventDoubleClick from '../../utils/withPreventDoubleClick';

const TO = withPreventDoubleClick(TouchableOpacity);

interface IMyButtonProps
  extends ContainedTouchableProperties,
    TouchableOpacityProps {
  children?: any;
  isActive?: boolean;
  ultraWidth?: boolean;
  type?: 'filled' | 'default';
  styleText?: StyleProp<TextStyle>;
}
const MyButton = ({
  children,
  isActive = false,
  ultraWidth = false,
  disabled = false,
  type = 'filled',
  style = {},
  styleText = {},
  containerStyle = {},
  ...props
}: IMyButtonProps) => {
  const {primary, border, text, background, lightBackground} = useTheme();

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
  if (disabled) {
    bg = lightBackground;
    borderColor = lightBackground;
    color = type === 'filled' ? color : lightBackground;
  }

  return (
    <TO
      containerStyle={[
        styles.con,
        {
          flexGrow: !ultraWidth ? 1 : 0,
        },
        containerStyle,
      ]}
      style={[
        styles.btn,
        {
          backgroundColor: bg,
          borderColor: borderColor,
          flexGrow: 1,
        },
        style,
      ]}
      {...props}>
      <MyText style={[styles.text, {color: color}, styleText]}>
        {children}
      </MyText>
    </TO>
  );
};

interface IGhostProps
  extends ContainedTouchableProperties,
    TouchableOpacityProps {
  children?: any;
  isActive?: boolean;
  ultraWidth?: boolean;
  styleText?: StyleProp<TextStyle>;
}

const GhostButton = ({
  children,
  isActive = false,
  ultraWidth = false,
  disabled = false,
  style = {},
  styleText = {},
  containerStyle = {},
  ...props
}: IGhostProps) => {
  const {primary, text} = useTheme();
  return (
    <MyButton
      style={[styles.gStyle, style]}
      styleText={[styles.gText, {color: isActive ? primary : text}, styleText]}
      containerStyle={[containerStyle]}
      {...props}>
      {children}
    </MyButton>
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
  con: {
    flexDirection: 'row',
  },
  gText: {
    textTransform: 'none',
    fontSize: sizes[8],
  },
  gStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
});

export {GhostButton};
export default MyButton;
