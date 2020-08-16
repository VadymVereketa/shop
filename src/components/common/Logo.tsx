import {Image} from 'react-native';
import {sizes} from '../../context/ThemeContext';
import React from 'react';

const Logo = () => {
  return (
    <Image
      source={require('../../assets/images/logo.png')}
      resizeMode={'cover'}
      style={{
        height: sizes[12],
        width: sizes[38],
        zIndex: 10,
      }}
    />
  );
};

export default Logo;
