import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import MyText from './MyText';
import {sizes, useTheme} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';

interface IRadioBlockProps {
  isActive?: boolean;
  onPress: any;
  title: string;
  text?: string;
  styleCon?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}
const RadioBlock = ({
  isActive = false,
  disabled = false,
  onPress,
  text,
  title,
  style,
  styleCon,
}: IRadioBlockProps) => {
  const {primary, border} = useTheme();

  const handlePress = () => {
    if (!disabled) {
      onPress();
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={handlePress}
      containerStyle={styleCon}
      style={[
        styles.con,
        {borderColor: border, opacity: disabled ? 0.2 : 1},
        style,
      ]}>
      <View
        style={[styles.bigCircle, {borderColor: isActive ? primary : border}]}>
        {isActive && (
          <View
            style={[
              styles.circle,
              {borderColor: primary, backgroundColor: primary},
            ]}
          />
        )}
      </View>
      <View style={styles.textBlock}>
        <MyText style={styles.title}>{title}</MyText>
        {text && <MyText style={styles.text}>{text}</MyText>}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  con: {
    borderWidth: 1,
    padding: sizes[10],
    flexDirection: 'row',
  },
  text: {
    fontSize: sizes[9],
  },
  title: {
    fontSize: sizes[9],
    fontFamily: getFontFamily('500'),
  },
  textBlock: {},
  bigCircle: {
    borderWidth: 1,
    width: sizes[12],
    height: sizes[12],
    borderRadius: sizes[6],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: sizes[10],
  },
  circle: {
    borderWidth: 1,
    width: sizes[4],
    height: sizes[4],
    borderRadius: sizes[2],
  },
});

export default RadioBlock;
