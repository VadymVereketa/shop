import React, {useEffect, useState} from 'react';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {IContact} from '../../typings/FetchData';
import {Dimensions, StyleSheet, View} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import MyText from '../controls/MyText';
import {getFontFamily} from '../../utils/getFontFamily';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  useResponsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {ContactScreenNavigationProp} from '../navigators/Menu.navigator';
import {useAxios} from '../../useHooks/useAxios';
import service from '../../services/service';
import {useDispatch} from 'react-redux';
import {actionsUser} from '../../redux/user/userReducer';
import IconButton from '../controls/IconButton';
import t from '../../utils/translate';

interface IContactBlockProps {
  contact: IContact;
}

const window = Dimensions.get('window');
const size = Math.max(window.width, window.height);

const ContactBlock = ({contact}: IContactBlockProps) => {
  const dispatch = useDispatch();
  const focus = useIsFocused();
  const navigation = useNavigation<ContactScreenNavigationProp>();
  const [isShow, setIsShow] = useState(false);
  const {border, lightText, background} = useTheme();
  const {isLoading, request} = useAxios(service.deleteContact);

  const handleRemove = async () => {
    const res = await request(contact.id);
    if (res.success) {
      dispatch(actionsUser.deleteContact(contact.id));
    }
  };

  useEffect(() => {
    if (!focus) {
      setIsShow(false);
    }
  }, [focus]);

  const handleEdit = () => {
    navigation.push('Contact', {
      contact,
    });
  };

  return (
    <View
      style={[styles.con, {borderColor: border, opacity: isLoading ? 0.3 : 1}]}>
      {isShow && (
        <TouchableWithoutFeedback
          onPress={() => setIsShow(false)}
          containerStyle={{
            position: 'absolute',
            width: size,
            height: size,
            zIndex: 1,
          }}
        />
      )}
      {isShow && (
        <View
          style={[
            styles.blockMenu,
            {borderColor: border, backgroundColor: background},
          ]}>
          <MyText
            style={[styles.textMenu, {marginBottom: sizes[5]}]}
            onPress={handleEdit}>
            {t('btnTextChange')}
          </MyText>
          <MyText style={styles.textMenu} onPress={handleRemove}>
            {t('btnTextRemove')}
          </MyText>
        </View>
      )}
      <View style={styles.topBlock}>
        <MyText
          style={
            styles.text
          }>{`${contact.firstName} ${contact.lastName}`}</MyText>
        <IconButton
          icon={{
            name: 'menu-keb',
            size: sizes[10],
            fill: lightText,
          }}
          style={{
            padding: sizes[4],
            marginRight: -sizes[8],
            marginTop: -sizes[4],
          }}
          onPress={() => setIsShow(true)}
        />
      </View>
      <MyText style={styles.text}>{contact.phone}</MyText>
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    padding: sizes[8],
    borderWidth: 1,
    borderRadius: 1,
    marginBottom: sizes[8],
  },
  text: {
    fontSize: sizes[9],
    fontFamily: getFontFamily('500'),
  },
  topBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: sizes[8],
  },
  point: {
    width: sizes[2],
    height: sizes[2],
    borderRadius: sizes[1],
    marginVertical: sizes[1],
  },
  points: {
    marginVertical: -sizes[1],
  },
  blockMenu: {
    padding: sizes[5],
    borderWidth: 1,
    position: 'absolute',
    right: -1,
    top: -sizes[6],
    zIndex: 10,
    width: sizes[70],
  },
  textMenu: {
    fontSize: sizes[9],
  },
});

export default ContactBlock;
