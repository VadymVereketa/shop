import React, {useEffect, useRef} from 'react';
import {sizes, useTheme} from '../../context/ThemeContext';
import Animated, {concat, Easing, timing} from 'react-native-reanimated';
import {StyleSheet, View} from 'react-native';
import DesignIcon from './DesignIcon';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';

interface ILoaderProps {
  isLoading: boolean;
  top: number;
}

const Loader = React.memo(({isLoading, top}: ILoaderProps) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const loadTop = useRef(new Animated.Value(0)).current;
  const {lightBackground, primary} = useTheme();

  useDidUpdateEffect(() => {
    if (isLoading) {
      animRotateLoading();
    }
    timing(loadTop, {
      toValue: isLoading ? sizes[30] : 0,
      duration: 200,
      easing: Easing.ease,
    }).start();
  }, [isLoading]);

  const animRotateLoading = () => {
    rotateAnim.setValue(0);

    timing(rotateAnim, {
      toValue: -360 * 10,
      duration: 10000,
      easing: Easing.linear,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.conLoading,
        {
          top: top,
          transform: [
            {
              translateY: loadTop,
            },
            {
              rotate: concat(rotateAnim, 'deg'),
            },
          ],
        },
      ]}>
      <View
        style={[
          styles.loading,
          {
            backgroundColor: lightBackground,
          },
        ]}>
        <DesignIcon name={'reload'} size={sizes[10]} fill={primary} />
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  conLoading: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 90,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loading: {
    borderRadius: sizes[30],
    padding: sizes[4],
  },
});

export default Loader;
