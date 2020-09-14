import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import BlockWrapperOrder from '../../common/BlockWrapperOrder';
import MyText from '../../controls/MyText';
import {getFontFamily} from '../../../utils/getFontFamily';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {ThirdStepScreenProps} from '../../navigators/Order.navigator';
import BlockPayment from '../../common/BlockPayment';
import {useCreateOrder} from '../../../useHooks/useCreateOrder';
const ThirdStepScreen = React.memo(
  ({navigation, route}: ThirdStepScreenProps) => {
    const {loading, submit} = useCreateOrder();

    const handleContinue = async () => {
      const res = await submit();
      if (res) {
        navigation.navigate('FinalStep', {});
      }
    };

    return (
      <BlockWrapperOrder isLoading={loading} handleContinue={handleContinue}>
        <MyText style={styles.text}>Оберіть спосіб оплати</MyText>
        <BlockPayment />
      </BlockWrapperOrder>
    );
  },
);

const styles = StyleSheet.create({
  text: {
    fontFamily: getFontFamily('500'),
    marginTop: sizes[5],
    marginBottom: sizes[8],
  },
  item: {
    marginBottom: sizes[6],
  },
});

export default ThirdStepScreen;
