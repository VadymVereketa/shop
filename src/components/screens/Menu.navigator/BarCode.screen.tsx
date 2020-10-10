import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  BarCodeScreenProps,
  CertificateScreenProps,
} from '../../navigators/Menu.navigator';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {getFontFamily} from '../../../utils/getFontFamily';
import Barcode from 'react-native-barcode-builder';
import MyText from '../../controls/MyText';

const BarCodeScreen = React.memo((props: BarCodeScreenProps) => {
  const {orderNumber} = props.route.params;
  const insets = useSafeAreaInsets();
  const {border} = useTheme();
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
      <MyText>Скануйте code і заберайте своє замовлення.</MyText>
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
