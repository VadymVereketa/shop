import React, {useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {TypePayment} from '../../constants/constantsId';
import RadioBlock from '../controls/RadioBlock';
import {sizes} from '../../context/ThemeContext';
import {actionsOrder, selectorsOrder} from '../../redux/order/orderReducer';
import {useDispatch, useSelector} from 'react-redux';
import {selectorsTypes} from '../../redux/types/typeReducer';
import {usePaymentOptions} from '../../useHooks/usePaymentOptions';

const BlockPayment = () => {
  const dispatch = useDispatch();
  const payments = useSelector(selectorsTypes.getPaymentsTypes);
  const payment = useSelector(selectorsOrder.getCodePayment);
  const options = usePaymentOptions();

  useEffect(() => {
    if (payment) return;

    dispatch(
      actionsOrder.setData({
        paymentType: payments.find((p) => p.code === TypePayment.cash)!,
      }),
    );
  }, []);

  const handleChange = (code: TypePayment) => {
    dispatch(
      actionsOrder.setData({
        paymentType: payments.find((p) => p.code === code)!,
      }),
    );
  };

  return (
    <View>
      {options.map((o, index) => {
        return (
          <RadioBlock
            key={index}
            isActive={payment === o.code}
            onPress={() => handleChange(o.code)}
            title={o.title}
            styleCon={styles.item}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    marginBottom: sizes[6],
  },
});

export default BlockPayment;
