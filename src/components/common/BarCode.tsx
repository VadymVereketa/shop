import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {IOrderItem} from '../../typings/FetchData';
import DesignIcon from './DesignIcon';
import {sizes, useTheme} from '../../context/ThemeContext';
import MyText from '../controls/MyText';
import {StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {getFontFamily} from '../../utils/getFontFamily';
import {BarCodeScreenNavigationProp} from '../navigators/Menu.navigator';
import t from '../../utils/translate';

interface IBarCodeProps {
  order: IOrderItem;
}
const BarCode = ({order}: IBarCodeProps) => {
  const navigation = useNavigation<BarCodeScreenNavigationProp>();
  const {border} = useTheme();

  const statuses = ['ready', 'done', 'reject'];

  const handlePress = () => {
    navigation.navigate('BarCode', {
      orderNumber: order.id,
    });
  };

  if (statuses.some((s) => s === order.orderStatus.code)) {
    return null;
  }
  return (
    <TouchableOpacity
      style={[styles.qr, {borderColor: border}]}
      onPress={handlePress}>
      <DesignIcon name={'barcode'} size={sizes[14]} fill={'black'} />
      <MyText style={styles.textOrder}>{t('commonCode')}</MyText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  qr: {
    marginTop: sizes[8],
    borderWidth: 1,
    padding: sizes[5],
    flexDirection: 'row',
    alignItems: 'center',
  },
  textOrder: {
    fontFamily: getFontFamily('500'),
    marginLeft: sizes[5],
  },
});
export default BarCode;
