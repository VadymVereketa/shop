import {useEffect, useRef} from 'react';
import Animated, {Easing, timing} from 'react-native-reanimated';

export const useLoadingAnim = (isLoading: boolean) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      animRotateLoading();
    }
  }, [isLoading]);

  const animRotateLoading = () => {
    rotateAnim.setValue(0);
    timing(rotateAnim, {
      toValue: -360 * 30,
      duration: 1000000,
      easing: Easing.linear,
    }).start();
  };

  return rotateAnim;
};
