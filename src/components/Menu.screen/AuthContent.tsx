import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {sizes, useTheme} from '../../context/ThemeContext';
import {selectorsOther} from '../../redux/other/otherReducer';
import {selectorsUser} from '../../redux/user/userReducer';
import {getFontFamily} from '../../utils/getFontFamily';
import t from '../../utils/translate';
import ChangeLocale from '../common/ChangeLocale';
import ChangeTheme from '../common/ChangeTheme';
import DesignIcon from '../common/DesignIcon';
import MyText from '../controls/MyText';
import PressTitle from '../controls/PressTitle';
import PhoneBlock from './PhoneBlock';

const AuthContent = () => {
  const navigation = useNavigation<any>();
  const phone = useSelector(selectorsOther.getPhone);
  const firstName = useSelector(selectorsUser.getFirstName);
  const {border, primary, text} = useTheme();

  return (
    <ScrollView contentContainerStyle={styles.contentContainerStyle}>
      <View>
        <PhoneBlock />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('MenuNavigator', {
              screen: 'Profile',
            });
          }}
          style={[
            styles.profileView,
            {
              borderColor: border,
            },
          ]}>
          <View style={styles.innerView}>
            <MyText style={styles.textProfile}>{t('profileTitle')}</MyText>
            <DesignIcon name={'next'} size={sizes[8]} fill={text} />
          </View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              flexGrow: 1,
            }}>
            <DesignIcon name="ProfileIcon" size={sizes[8]} fill={primary} />
            <MyText
              style={{
                marginLeft: sizes[5],
                fontSize: sizes[11],
              }}>
              {firstName}
            </MyText>
          </View>
        </TouchableOpacity>
        <PressTitle
          onPress={() =>
            navigation.navigate('MenuNavigator', {
              screen: 'Orders',
            })
          }
          style={styles.itemMenu}
          isBorder>
          {t('profileMyOrders')}
        </PressTitle>
        <PressTitle
          onPress={() =>
            navigation.navigate('MenuNavigator', {
              screen: 'Locations',
            })
          }
          style={[styles.itemMenu, {borderTopColor: border}]}
          isBorder>
          {t('storeLocations')}
        </PressTitle>
      </View>
      <View>
        <ChangeLocale />
        <ChangeTheme />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  container: {
    flexDirection: 'column',
    marginHorizontal: sizes[5],
    flexGrow: 1,
  },
  text: {
    textAlign: 'center',
    paddingVertical: sizes[5],
    fontSize: sizes[10],
    fontFamily: getFontFamily('500'),
  },
  btnTop: {
    marginTop: sizes[10],
    marginBottom: sizes[5],
  },
  btn: {
    borderRadius: sizes[1],
  },
  itemMenu: {
    paddingVertical: sizes[9],
  },
  itemMenuBorder: {},
  locations: {
    paddingTop: sizes[20],
    paddingBottom: sizes[4],
    paddingLeft: sizes[6],
    borderBottomWidth: 1,
  },
  profileView: {
    padding: sizes[5],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  innerView: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexGrow: 1,
    marginBottom: sizes[5],
  },
  textProfile: {
    fontSize: sizes[9],
    fontFamily: getFontFamily('400'),
  },
});

export default AuthContent;
