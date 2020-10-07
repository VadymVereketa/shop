import React, {useEffect, useState} from 'react';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {IAddress, ICard, IContact} from '../../typings/FetchData';
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
import CreditCard from './CreditCard';

interface ICreditCardBlockProps {
  card: ICard;
}

const CreditCardBlock = ({card}: ICreditCardBlockProps) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<ContactScreenNavigationProp>();
  const {isLoading, request} = useAxios(service.deleteCard);

  const handleRemove = async () => {
    const res = await request(card.id);
    if (res.success) {
      dispatch(actionsUser.deleteCard(card.id));
    }
  };

  return (
    <ItemWithMenu
      isLoading={isLoading}
      menu={
        <React.Fragment>
          <MyText style={styles.textMenu} onPress={handleRemove}>
            {t('btnTextRemove')}
          </MyText>
        </React.Fragment>
      }
      content={
        <CreditCard
          card={card}
          isActive={false}
          style={{
            borderWidth: 0,
            padding: 0,
            margin: 0,
          }}
        />
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

export default CreditCardBlock;
