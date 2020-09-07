import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import BlockWrapperOrder from '../../common/BlockWrapperOrder';
import MyText from '../../controls/MyText';
import {getFontFamily} from '../../../utils/getFontFamily';
import {sizes} from '../../../context/ThemeContext';
import RadioBlock from '../../controls/RadioBlock';
import {useDispatch, useSelector} from 'react-redux';
import {actionsOrder, selectorsOrder} from '../../../redux/order/orderReducer';
import {selectorsTypes} from '../../../redux/types/typeReducer';
import {TypePayment} from '../../../constants/constantsId';
import service from '../../../services/service';
import {selectorsCart} from '../../../redux/cart/cartReducer';
import {actionsOther, selectorsOther} from '../../../redux/other/otherReducer';
import {ThirdStepScreenProps} from '../../navigators/Order.navigator';
import {selectorsUser} from '../../../redux/user/userReducer';
import {formatAddress} from '../../../utils/formatAddress';
import BlockPayment from '../../common/BlockPayment';
import {useCreateOrder} from '../../../useHooks/useCreateOrder';

const ThirdStepScreen = React.memo(
  ({navigation, route}: ThirdStepScreenProps) => {
    const {loading, createOrder} = useCreateOrder();

    const handleContinue = async () => {
      const res = await createOrder();
      if (res) {
        navigation.navigate('FinalStep', {});
      }
    };

    return (
      <BlockWrapperOrder disabled={!loading} handleContinue={handleContinue}>
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
