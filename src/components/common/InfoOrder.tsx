import React from 'react';
import {StyleSheet, View} from 'react-native';
import MyText from '../controls/MyText';
import {sizes, useTheme} from '../../context/ThemeContext';
import {
  formatTime,
  useFormattingContext,
} from '../../context/FormattingContext';
import {getFontFamily} from '../../utils/getFontFamily';
import {IOrderStatus} from '../../typings/FetchData';

interface IInfoOrderProps {
  id: number;
  minExecuteDate: string;
  maxExecuteDate: string;
  orderAddress: string;
  orderStatus: IOrderStatus;
}

const getStyleStatus = (str: string) => {
  const success = ['confirm', 'done', 'ready'];
  const preparation = [
    'new',
    'inprogress',
    'courier',
    'ontheway',
    'courier',
    'newweb',
  ];

  if (success.some((s) => s === str)) return styles.successStatus;
  else if (preparation.some((s) => s === str)) return styles.preparationStatus;
  else return styles.errorStatus;
};

const InfoOrder = ({
  id,
  maxExecuteDate,
  minExecuteDate,
  orderAddress,
  orderStatus,
}: IInfoOrderProps) => {
  const {lightText} = useTheme();
  const {longFormatDate} = useFormattingContext();

  const getDateOrder = () => {
    let str = longFormatDate(new Date(minExecuteDate));
    if (orderAddress) {
      str += ` | ${formatTime(new Date(minExecuteDate))} -  ${formatTime(
        new Date(maxExecuteDate),
      )}`;
    } else {
      str += ` | ${formatTime(new Date(minExecuteDate))}`;
    }
    return str;
  };

  return (
    <React.Fragment>
      <View style={styles.infoOrder}>
        <MyText style={styles.textOrder}>№ {(id + '').padStart(9, '0')}</MyText>
        <MyText
          style={[
            styles.textStatus,
            getStyleStatus(orderStatus.code.toLowerCase()),
          ]}>
          {orderStatus.status}
        </MyText>
      </View>
      <MyText style={{color: lightText}}>{getDateOrder()}</MyText>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  infoOrder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: sizes[3],
  },
  textOrder: {
    fontFamily: getFontFamily('500'),
  },
  textStatus: {
    fontFamily: getFontFamily('500'),
    textTransform: 'uppercase',
  },
  successStatus: {
    color: '#18aa13',
  },
  preparationStatus: {
    color: '#01a6e6',
  },
  errorStatus: {
    color: '#dc3545',
  },
});

export default InfoOrder;
