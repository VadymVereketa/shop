import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableWithoutFeedbackProps,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import MyText from './MyText';
import React, {useRef, useState} from 'react';
import DesignIcon, {IDesignIconProps, IName} from '../common/DesignIcon';
import {sizes, useTheme} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import IconButton from './IconButton';
import Animated, {Easing, timing, concat} from 'react-native-reanimated';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import withPreventDoubleClick from '../../utils/withPreventDoubleClick';

const TWF = withPreventDoubleClick(TouchableWithoutFeedback);

interface IPressTitleProps extends TouchableWithoutFeedbackProps {
  children?: any;
  styleText?: StyleProp<TextStyle>;
  expand?: boolean;
  isBorder?: boolean;
  afterIcon?: IDesignIconProps;
}
const PressTitle = ({
  style = {},
  styleText = {},
  expand = false,
  isBorder = false,
  onPress,
  children,
  afterIcon,
}: IPressTitleProps) => {
  const rotate = useRef(new Animated.Value(90)).current;
  const [isRotate, setIsRotate] = useState(false);
  const {text, border, background} = useTheme();

  const handlePress = (e: any) => {
    if (onPress) {
      onPress(e);
    }
    if (expand) {
      setIsRotate((r) => !r);
    }
  };

  useDidUpdateEffect(() => {
    timing(rotate, {
      toValue: isRotate ? -90 : 90,
      duration: 100,
      easing: Easing.linear,
    }).start();
  }, [isRotate]);

  return (
    <TWF
      style={[
        styles.con,
        {
          borderBottomColor: isBorder ? border : background,
          backgroundColor: background,
        },
        style,
      ]}
      onPress={handlePress}>
      <MyText style={[styles.text, styleText]}>{children}</MyText>
      {!afterIcon ? (
        expand ? (
          <Animated.View
            style={{
              justifyContent: 'center',
              transform: [
                {
                  rotate: concat(rotate, 'deg'),
                },
              ],
            }}>
            <DesignIcon name={'next'} size={sizes[8]} fill={text} />
          </Animated.View>
        ) : (
          <DesignIcon name={'next'} size={sizes[8]} fill={text} />
        )
      ) : (
        <DesignIcon
          name={afterIcon.name}
          size={afterIcon.size}
          fill={afterIcon.fill}
        />
      )}
    </TWF>
  );
};

const styles = StyleSheet.create({
  con: {
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: sizes[6],
    borderBottomWidth: 1,
  },
  text: {
    fontSize: sizes[9],
    fontFamily: getFontFamily('500'),
  },
});

export default PressTitle;
