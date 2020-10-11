import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {BarCodeScreenProps} from '../../navigators/Menu.navigator';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {getFontFamily} from '../../../utils/getFontFamily';
import Barcode from 'react-native-barcode-builder';
import MyText from '../../controls/MyText';
import ScreenBrightness from 'react-native-screen-brightness';
import t from '../../../utils/translate';

const BarCodeScreen = React.memo((props: BarCodeScreenProps) => {
  const {orderNumber} = props.route.params;
  const insets = useSafeAreaInsets();
  const {border} = useTheme();

  useEffect(() => {
    ScreenBrightness.getBrightness().then((brightness) => {
      ScreenBrightness.setBrightness(1); // between 0 and 1
    });
    return () => {
      ScreenBrightness.setBrightness(0.5); // between 0 and 1
    };
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          marginTop: -insets.top,
        },
      ]}>
      <View
        style={[
          styles.box,
          {
            borderColor: border,
          },
        ]}>
        <Barcode
          value={orderNumber.toString().padStart(12, '0')}
          width={3}
          height={150}
          format="CODE128"
        />
      </View>
      <MyText>{t('commonScanCode')}</MyText>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    marginHorizontal: sizes[5],
    flex: 1,
  },
  title: {
    fontSize: sizes[9],
    fontFamily: getFontFamily('500'),
    marginVertical: sizes[10],
  },
  bold: {
    fontFamily: getFontFamily('500'),
  },
  p: {
    marginBottom: sizes[10],
  },
  box: {
    borderWidth: 1,
    padding: sizes[15],
    marginVertical: sizes[10],
  },
});

export default BarCodeScreen;
