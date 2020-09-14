import React from 'react';
import {ICard} from '../../typings/FetchData';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import MyText from '../controls/MyText';
import {sizes, useTheme} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import {TouchableOpacity} from 'react-native-gesture-handler';
const MasterCard = require('../../assets/images/mastercard_logo.svg').default;
const VisaCard = require('../../assets/images/visa_logo.svg').default;

interface ICreditCard {
  card: ICard;
  isActive: boolean;
  onPress?: any;
  style?: StyleProp<ViewStyle>;
}
const formatCard = (card: string) => {
  return `${card.substr(0, 4)} ${card.substr(4, 4)} ${card.substr(
    8,
    4,
  )} ${card.substr(12, 4)}`;
};

const getOptionsByCard = (card: string) => {
  const paymentSystems = [
    {
      numbers: ['30', '36', '38'],
      logo: null,
      name: 'Diners Club',
    },
    {
      numbers: ['31', '35'],
      logo: null,
      name: 'JCB International',
    },
    {
      numbers: ['34', '37'],
      logo: null,
      name: 'American Express',
    },
    {
      numbers: ['4'],
      logo: VisaCard,
      name: 'VISA',
    },
    {
      numbers: ['50', '56', '57', '58', '51', '52', '53', '54', '55'],
      logo: MasterCard,
      name: 'MasterCard',
    },
    {
      numbers: ['60'],
      logo: null,
      name: 'Discover',
    },
    {
      numbers: ['62'],
      logo: null,
      name: 'China UnionPay',
    },
    {
      numbers: ['63', '67'],
      logo: null,
      name: 'Maestro',
    },
  ];

  let findItem = paymentSystems.find((p) =>
    p.numbers.some((n) => card.startsWith(n)),
  );
  return findItem
    ? findItem
    : {
        name: '',
        logo: null,
        numbers: [],
      };
};

const CreditCard = ({card, isActive, onPress, style}: ICreditCard) => {
  const {border, primary} = useTheme();

  const options = getOptionsByCard(card.number);
  const Logo = options.logo;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.view, {borderColor: isActive ? primary : border}, style]}>
      {Logo && <Logo width={sizes[20]} height={sizes[20]} />}
      <MyText style={styles.text}>
        {card.id !== -1 ? formatCard(card.number) : card.number}
      </MyText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  view: {
    borderWidth: 1,
    paddingHorizontal: sizes[6],
    height: sizes[30],
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: sizes[9],
    fontFamily: getFontFamily('500'),
    paddingLeft: sizes[8],
  },
});

export default CreditCard;
