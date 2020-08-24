import React from 'react';
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

const ProfileScreen = (props: ProfileScreenProps) => {
  const dispatch = useDispatch();
  const {border, lightBackground, text} = useTheme();
  const user = useSelector(selectorsUser.getUser)! || {};

  const handleLogout = async () => {
    const res = await service.logout();
    if (res) {
      dispatch(actionsUser.logout());
    }
  };

  return (
    <ScrollView style={[styles.container]} bounces={false}>
      <MyText style={styles.text}>{t('profileLocaleData')}</MyText>
      <View style={[styles.box, {borderColor: border}]}>
        <MyText style={styles.mainText}>{`${user!.firstName} ${
          user!.lastName
        }`}</MyText>
      </View>
      <View style={[styles.box, {borderColor: border}]}>
        <MyText style={styles.mainText}>{user.phone}</MyText>
        {user.email && <MyText style={styles.mainText}>{user.email}</MyText>}
      </View>
      <PressTitle>{t('profileCertificate')}</PressTitle>
      <PressTitle>{t('profileLoyaltyCard')}</PressTitle>
      <TouchableOpacity
        onPress={handleLogout}
        style={[styles.btnExit, {backgroundColor: lightBackground}]}>
        <DesignIcon name={'log-out'} size={sizes[10]} fill={text} />
        <MyText style={{marginLeft: sizes[5]}}>{t('btnExit')}</MyText>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: sizes[5],
  },
  text: {
    fontFamily: getFontFamily('500'),
    paddingVertical: sizes[8],
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
});

export default ProfileScreen;
