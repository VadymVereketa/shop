import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import MyText from '../../controls/MyText';
import {sizes, useTheme} from '../../../context/ThemeContext';
import PressTitle from '../../controls/PressTitle';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getFontFamily} from '../../../utils/getFontFamily';
import {MenuScreenProps} from '../../navigators/Main.navigator';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectorCategory,
  thunkGetCustomCategories,
} from '../../../redux/category/categoryReducer';
import {selectorsUser} from '../../../redux/user/userReducer';
import DesignIcon from '../../common/DesignIcon';
import {getSellPoints} from '../../../redux/sellPoints/sellPointsReducer';
import {selectorsOther} from '../../../redux/other/otherReducer';
import t from '../../../utils/translate';

const MenuScreen = ({navigation}: MenuScreenProps) => {
  const phone = useSelector(selectorsOther.getPhone);
  const isAuth = useSelector(selectorsUser.isAuth);
  const {border, lightBackground, primary} = useTheme();
  const sellPoints = useSelector(getSellPoints(false));

  return (
    <SafeAreaView style={[styles.container]}>
      {isAuth ? (
        <ScrollView>
          <View style={[styles.infoBlock, {backgroundColor: lightBackground}]}>
            <View>
              <MyText style={{fontSize: sizes[7]}}>{t('profileCall')}</MyText>
              <MyText
                style={{fontSize: sizes[7], fontFamily: getFontFamily('500')}}>
                10:00 - 19:00
              </MyText>
            </View>
            <View style={styles.phoneBlock}>
              <DesignIcon name={'phone'} size={sizes[8]} fill={primary} />
              <MyText style={styles.phone}>{phone}</MyText>
            </View>
          </View>
          <PressTitle
            onPress={() =>
              navigation.navigate('MenuNavigator', {
                screen: 'Profile',
              })
            }
            style={[
              styles.itemMenu,
              styles.itemMenuBorder,
              {borderTopColor: border},
            ]}
            isBorder>
            {t('profileTitle')}
          </PressTitle>
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
                screen: 'Settings',
              })
            }
            style={styles.itemMenu}
            isBorder>
            {t('profileSettings')}
          </PressTitle>

          <View style={[styles.locations, {borderBottomColor: border}]}>
            <MyText>{t('profileLocations')}</MyText>
          </View>
          {sellPoints.map((s) => {
            return (
              <PressTitle key={s.id} style={styles.itemMenu} isBorder>
                {s.name}
              </PressTitle>
            );
          })}
        </ScrollView>
      ) : (
        <React.Fragment>
          <MyText style={[styles.text]}> {t('profileTitle')}</MyText>
          <View style={{height: 1, backgroundColor: border}} />
          <PressTitle
            onPress={() => {
              navigation.navigate('AuthNavigator', {screen: 'Login'});
            }}
            style={[
              styles.btn,
              styles.btnTop,
              {backgroundColor: lightBackground},
            ]}>
            {t('profileLogin')}
          </PressTitle>
          <PressTitle
            onPress={() => {
              navigation.navigate('AuthNavigator', {screen: 'SignUp'});
            }}
            style={[styles.btn, {backgroundColor: lightBackground}]}>
            {t('profileSignUp')}
          </PressTitle>
        </React.Fragment>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginHorizontal: sizes[5],
    flex: 1,
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
  infoBlock: {
    marginVertical: sizes[8],
    borderRadius: sizes[1],
    paddingHorizontal: sizes[5],
    paddingVertical: sizes[2],
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  phoneBlock: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phone: {
    marginRight: sizes[9],
    marginLeft: sizes[3],
    fontFamily: getFontFamily('500'),
  },
  itemMenu: {
    paddingVertical: sizes[9],
  },
  itemMenuBorder: {
    borderTopWidth: 1,
  },
  locations: {
    paddingTop: sizes[20],
    paddingBottom: sizes[4],
    paddingLeft: sizes[6],
    borderBottomWidth: 1,
  },
});

export default MenuScreen;
