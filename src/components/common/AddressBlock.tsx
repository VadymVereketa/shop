import React, {useEffect, useState} from 'react';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {IAddress, IContact} from '../../typings/FetchData';
import {Dimensions, StyleSheet, View} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import MyText from '../controls/MyText';
import {getFontFamily} from '../../utils/getFontFamily';
import {ContactScreenNavigationProp} from '../navigators/Menu.navigator';
import {useAxios} from '../../useHooks/useAxios';
import service from '../../services/service';
import {useDispatch} from 'react-redux';
import {actionsUser} from '../../redux/user/userReducer';
import t from '../../utils/translate';
import ItemWithMenu from './ItemWithMenu';
import {formatAddress} from '../../utils/formatAddress';

interface IAddressBlockProps {
  address: IAddress;
}

const AddressBlock = ({address}: IAddressBlockProps) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<ContactScreenNavigationProp>();
  const {isLoading, request} = useAxios(service.deleteAddress);

  const handleRemove = async () => {
    const res = await request(address.id);
    if (res.success) {
      dispatch(actionsUser.deleteAddress(address.id));
    }
  };

  const handleEdit = () => {
    navigation.navigate('AddressNavigator', {
      screen: 'Address',
      params: {
        address: address,
      },
    });
  };

  return (
    <ItemWithMenu
      isLoading={isLoading}
      menu={
        <React.Fragment>
          <MyText
            style={[styles.textMenu, {marginBottom: sizes[5]}]}
            onPress={handleEdit}>
            {t('btnTextChange')}
          </MyText>
          <MyText style={styles.textMenu} onPress={handleRemove}>
            {t('btnTextRemove')}
          </MyText>
        </React.Fragment>
      }
      content={
        <React.Fragment>
          <MyText style={styles.text}>{formatAddress(address)}</MyText>
        </React.Fragment>
      }
    />
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: sizes[9],
    fontFamily: getFontFamily('500'),
    flexShrink: 1,
  },
  textMenu: {
    fontSize: sizes[9],
  },
});

export default AddressBlock;
