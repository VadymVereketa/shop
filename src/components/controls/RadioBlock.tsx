import React, {useEffect, useRef} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import MyText from './MyText';
import {sizes, useTheme} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import Animated, {Easing, timing} from 'react-native-reanimated';
import {useLoadingAnim} from '../../useHooks/useLoadingAnim';
import DesignIcon from '../common/DesignIcon';

interface IRadioBlockProps {
  isActive?: boolean;
  onPress: any;
  title: string;
  text?: string;
  styleCon?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  isLoading?: boolean;
}
const RadioBlock = React.memo(
  ({
    isActive = false,
    disabled = false,
    isLoading = false,
    onPress,
    text,
    title,
    style,
    styleCon,
  }: IRadioBlockProps) => {
    const {primary, border} = useTheme();
    const rotateAnim = useLoadingAnim(isLoading);

    const handlePress = () => {
      if (disabled || isLoading) return;

      onPress();
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
          style={[
            styles.bigCircle,
            {borderColor: isActive ? primary : border},
          ]}>
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
        {isLoading && (
          <Animated.View
            style={{
              flexGrow: 1,
              alignItems: 'flex-end',
            }}>
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: rotateAnim,
                  },
                ],
              }}>
              <DesignIcon name={'reload'} size={sizes[10]} fill={primary} />
            </Animated.View>
          </Animated.View>
        )}
      </TouchableWithoutFeedback>
    );
  },
);

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
    fontFamily: getFontFamily('400'),
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
