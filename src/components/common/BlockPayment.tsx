import React, {useEffect, useMemo} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {TypePayment} from '../../constants/constantsId';
import RadioBlock from '../controls/RadioBlock';
import {sizes} from '../../context/ThemeContext';
import {actionsOrder, selectorsOrder} from '../../redux/order/orderReducer';
import {useDispatch, useSelector} from 'react-redux';
import {selectorsTypes} from '../../redux/types/typeReducer';
import {usePaymentOptions} from '../../useHooks/usePaymentOptions';
import MyText from '../controls/MyText';
import {getFontFamily} from '../../utils/getFontFamily';
import {selectorsUser} from '../../redux/user/userReducer';
import CreditCard from './CreditCard';
import {ICard} from '../../typings/FetchData';
import t from '../../utils/translate';

const BlockPayment = () => {
  const dispatch = useDispatch();
  const id = useSelector(selectorsOrder.getCardId);
  const payments = useSelector(selectorsTypes.getPaymentsTypes);
  const payment = useSelector(selectorsOrder.getCodePayment);
  const cards = useSelector(selectorsUser.getCards);
  const isExpress = useSelector(selectorsOrder.isDeliveryExpress);

  const options = usePaymentOptions();
  const otherCard: ICard = useMemo(() => {
    return {
      token: '',
      number: t('orderPayCard'),
      id: -1,
      description: '',
    };
  }, []);

  useEffect(() => {
    if (payment) return;

    if (isExpress) {
      dispatch(
        actionsOrder.setData({
          paymentType: payments.find((p) => p.code === TypePayment.online)!,
        }),
      );
    } else {
      dispatch(
        actionsOrder.setData({
          paymentType: payments.find((p) => p.code === TypePayment.cash)!,
        }),
      );
    }
  }, []);

  const handleChange = (code: TypePayment) => {
    dispatch(
      actionsOrder.setData({
        paymentType: payments.find((p) => p.code === code)!,
      }),
    );
  };

  const setId = (value: number) => {
    dispatch(
      actionsOrder.setData({
        cardId: value,
      }),
    );
  };

  const handleChangeCard = (value: number) => {
    setId(value);
  };

  useEffect(() => {
    if (cards.length > 0) {
      setId(cards[0].id);
    } else {
      setId(-1);
    }
  }, []);

  const filterOptions = isExpress
    ? options.filter((opt) => opt.code === TypePayment.online)
    : options;

  return (
    <View>
      {filterOptions.map((o, index) => {
        return (
          <RadioBlock
            key={index}
            isActive={payment === o.code}
            onPress={() => handleChange(o.code)}
            title={o.title}
            styleCon={styles.item}
            isIcon={Platform.OS === 'ios' && o.icon}
          />
        );
      })}
      {payment === TypePayment.online && cards.length > 0 && (
        <View>
          <MyText style={styles.text}>Картки</MyText>
          {cards.map((c) => (
            <CreditCard
              style={styles.card}
              card={c}
              isActive={c.id === id}
              onPress={() => handleChangeCard(c.id)}
            />
          ))}
          <CreditCard
            style={styles.card}
            card={otherCard}
            isActive={id === -1}
            onPress={() => handleChangeCard(-1)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    marginBottom: sizes[6],
  },
  text: {
    fontFamily: getFontFamily('500'),
    marginBottom: sizes[5],
  },
  card: {
    marginBottom: sizes[5],
    height: sizes[30],
  },
});

export default BlockPayment;
