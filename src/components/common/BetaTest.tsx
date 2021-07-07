import React from 'react';
import {Linking, View} from 'react-native';
import MyText from '../controls/MyText';
import {sizes, useTheme} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import t from '../../utils/translate';

const BetaTest = () => {
  const {primary} = useTheme();

  const handlePhone = () => {
    Linking.openURL(`tel:+380664724520`);
  };

  return (
    <View style={{alignItems: 'center'}}>
      <MyText style={{fontSize: sizes[10]}}>
        {t('betaTestTitle')}
      </MyText>
      <MyText
        style={{
          fontSize: sizes[10],
          color: primary,
          fontFamily: getFontFamily('500'),
        }}
        onPress={handlePhone}>
        +380 (66) 472 45 20
      </MyText>
    </View>
  );
};

export default BetaTest;
