import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import DesignIcon from './DesignIcon';
import {sizes, useTheme} from '../../context/ThemeContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import IconButton from './IconButton';

const Logo = () => {
  return (
    <Image
      source={require('../../assets/images/logo.png')}
      resizeMode={'cover'}
      style={{
        height: sizes[12],
        width: sizes[38],
        zIndex: 100,
      }}
    />
  );
};

const Header = () => {
  const {text} = useTheme();
  const {top} = useSafeAreaInsets();
  return (
    <View style={[styles.con, {paddingTop: top ? top : sizes[7]}]}>
      <Logo />
      <IconButton
        icon={{
          name: 'search',
          size: sizes[12],
          fill: text,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: sizes[5],
    zIndex: 100,
    backgroundColor: 'white',
  },
});

export default Header;
