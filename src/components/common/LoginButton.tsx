import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {sizes, useTheme} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import t from '../../utils/translate';
import MyText from '../controls/MyText';
import DesignIcon from './DesignIcon';

const LoginButton = () => {
  const {primary, background} = useTheme();

  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('AuthNavigator', {
          screen: 'Login',
        });
      }}
      style={[
        styles.touchable,
        {
          backgroundColor: primary,
        },
      ]}>
      <MyText
        style={{
          color: background,
          fontFamily: getFontFamily('400'),
        }}>
        {t('enterToLocalAccount1')}
        {t('enterToLocalAccount2')}
      </MyText>
      <DesignIcon name={'next'} size={sizes[8]} fill={background} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: sizes[8],
    paddingHorizontal: sizes[6],
    borderRadius: sizes[2],
  },
});

export default LoginButton;
