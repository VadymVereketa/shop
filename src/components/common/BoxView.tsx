import {View} from 'react-native';
import React from 'react';
import {useResponsiveWidth} from 'react-native-responsive-dimensions';
import {BoxShadow} from 'react-native-shadow';

const BoxView = ({children}: any) => {
  const w = useResponsiveWidth(100);

  const shadowOpt = {
    width: w,
    height: 0,
    color: '#a0a0a0',
    border: 3,
    radius: 0,
    opacity: 0.3,
    side: 'bottom',
    x: 0,
    y: 1,
    style: {},
  };

  return (
    <View>
      {children}
      <BoxShadow setting={shadowOpt} />
    </View>
  );
};

export default BoxView;
