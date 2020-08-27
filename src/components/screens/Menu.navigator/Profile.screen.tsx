import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {ProfileScreenProps} from '../../navigators/Menu.navigator';
import {useDispatch, useSelector} from 'react-redux';
import {actionsUser, selectorsUser} from '../../../redux/user/userReducer';
import {getFontFamily} from '../../../utils/getFontFamily';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import MyText from '../../controls/MyText';
import {sizes, useTheme} from '../../../context/ThemeContext';
import PressTitle from '../../controls/PressTitle';
import DesignIcon from '../../common/DesignIcon';
import t from '../../../utils/translate';
import service from '../../../services/service';
import ContactBlock from '../../common/ContactBlock';

const ProfileScreen = React.memo(({navigation}: ProfileScreenProps) => {
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(true);
  const {border, lightBackground, text, lightText, primary} = useTheme();
  const contacts = useSelector(selectorsUser.getContacts);
  const user = useSelector(selectorsUser.getUser)! || {};

  const handleLogout = async () => {
    const res = await service.logout();
    if (res) {
      dispatch(actionsUser.logout());
    }
  };

  return (
    <ScrollView style={[styles.container]} bounces={false}>
      <View style={{flexDirection: 'row'}}>
        <MyText
          onPress={() => setToggle(true)}
          style={[styles.text, {color: toggle === true ? text : lightText}]}>
          {t('profileLocaleData')}
        </MyText>
        <MyText
          onPress={() => setToggle(false)}
          style={[styles.text, {color: toggle === true ? lightText : text}]}>
          {t('profileSaveContacts')}
        </MyText>
      </View>
      {toggle ? (
        <React.Fragment>
          <View style={[styles.box, {borderColor: border}]}>
            <MyText
              onPress={() =>
                navigation.push('EditProfile', {
                  field: 'name',
                })
              }
              style={styles.mainText}>{`${user!.firstName} ${
              user!.lastName
            }`}</MyText>
          </View>
          <View style={[styles.box, {borderColor: border}]}>
            <MyText
              onPress={() =>
                navigation.push('EditProfile', {
                  field: 'phone',
                })
              }
              style={styles.mainText}>
              {user.phone}
            </MyText>
          </View>
          {user.email ? (
            <View style={[styles.box, {borderColor: border}]}>
              <MyText
                onPress={() =>
                  navigation.push('EditProfile', {
                    field: 'email',
                  })
                }
                style={styles.mainText}>
                {user.email}
              </MyText>
            </View>
          ) : (
            <MyText
              style={{color: primary}}
              onPress={() =>
                navigation.push('EditProfile', {
                  field: 'email',
                })
              }>
              + Додати email
            </MyText>
          )}
        </React.Fragment>
      ) : (
        <View>
          {contacts.map((c) => (
            <ContactBlock key={c.id} contact={c} />
          ))}
          <MyText
            style={{color: primary}}
            onPress={() => navigation.push('Contact', {})}>
            + Додати контакт
          </MyText>
        </View>
      )}
      <PressTitle
        style={styles.press}
        onPress={() => navigation.push('Certificate', {})}>
        {t('profileCertificate')}
      </PressTitle>
      <PressTitle
        style={styles.press}
        onPress={() => navigation.push('LoyaltyCard', {})}>
        {t('profileLoyaltyCard')}
      </PressTitle>
      <TouchableOpacity
        onPress={handleLogout}
        style={[styles.btnExit, {backgroundColor: lightBackground}]}>
        <DesignIcon name={'log-out'} size={sizes[10]} fill={text} />
        <MyText style={{marginLeft: sizes[5]}}>{t('btnExit')}</MyText>
      </TouchableOpacity>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: sizes[5],
  },
  text: {
    fontFamily: getFontFamily('500'),
    paddingVertical: sizes[8],
    marginRight: sizes[16],
  },
  box: {
    paddingHorizontal: sizes[8],
    paddingVertical: sizes[6],
    borderRadius: sizes[1],
    borderWidth: 1,
    marginBottom: sizes[5],
  },
  mainText: {
    fontSize: sizes[10],
    fontFamily: getFontFamily('500'),
  },
  btnExit: {
    paddingVertical: sizes[7],
    paddingHorizontal: sizes[10],
    flexDirection: 'row',
  },
  press: {
    paddingLeft: 0,
  },
});

export default ProfileScreen;
