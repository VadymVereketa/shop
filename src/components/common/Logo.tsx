import {Image} from 'react-native';
import {sizes} from '../../context/ThemeContext';
import React from 'react';

interface ILogoProps {
  width: any;
  height: any;
  resizeMode: 'cover' | 'contain' | 'center' | 'stretch';
}
const Logo = ({
  height = sizes[12],
  resizeMode = 'cover',
  width = sizes[38],
}: ILogoProps) => {
  return (
    <Image
      source={require('../../assets/images/logo.png')}
      resizeMode={resizeMode}
      style={{
        height,
        width,
        zIndex: 10,
      }}
    />
  );
};

export default Logo;
