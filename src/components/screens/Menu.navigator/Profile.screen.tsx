import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {ProfileScreenProps} from '../../navigators/Menu.navigator';
import {useDispatch, useSelector} from 'react-redux';
import {actionsUser, selectorsUser} from '../../../redux/user/userReducer';
import {getFontFamily} from '../../../utils/getFontFamily';
import {
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import MyText from '../../controls/MyText';
import {sizes, useTheme} from '../../../context/ThemeContext';
import PressTitle from '../../controls/PressTitle';
import DesignIcon from '../../common/DesignIcon';
import t from '../../../utils/translate';
import service from '../../../services/service';
import ContactBlock from '../../common/ContactBlock';
import {formatAddress} from '../../../utils/formatAddress';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import portmone from '../../../utils/portmone';
import uuid from 'react-native-uuid';
import CreditCard from '../../common/CreditCard';
import Toast from 'react-native-simple-toast';
import {useFormattingContext} from '../../../context/FormattingContext';
import {actionsOrder} from '../../../redux/order/orderReducer';
import AddressBlock from '../../common/AddressBlock';
import CreditCardBlock from '../../common/CreditCardBlock';
import BetaTest from '../../common/BetaTest';
import {formatPhone} from '../../../utils/normalizePhone';

const ProfileScreen = React.memo(({navigation}: ProfileScreenProps) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [toggle, setToggle] = useState(true);
  const {border, lightBackground, text, lightText, primary, theme} = useTheme();
  const {currentLocale} = useFormattingContext();
  const contacts = useSelector(selectorsUser.getContacts);
  const addresses = useSelector(selectorsUser.getAddresses);
  const user = useSelector(selectorsUser.getUser)! || {};
  const cards = useSelector(selectorsUser.getCards);

  const handleLogout = async () => {
    const res = await service.logout();
    if (res) {
      dispatch(actionsUser.logout());
      dispatch(actionsOrder.clear());
    }
  };

  const handleAddCard = async () => {
    const description = uuid.v4();
    const billNumber = uuid.v4();
    let res = await portmone.initCardSaving({
      desc: description,
      billNumber,
      theme: theme,
      lang: currentLocale,
    });
    if (res.result === 'success') {
      res = await service.createCard({
        ...res,
        DESCRIPTION: description,
        ERRORIPSCODE: 'null',
      });
      if (res.success) {
        dispatch(
          actionsUser.setCards([
            {
              description: res.data.description,
              id: res.data.id,
              number: res.data.number,
              token: res.data.token,
            },
            ...cards,
          ]),
        );
        Toast.show(t('successCardSave'));
      } else {
        Toast.show(res.data);
      }
    }
  };

  return (
    <SafeAreaView
      style={{
        marginTop: -insets.top,
      }}>
      <ScrollView
        style={[styles.container]}
        bounces={false}
        showsVerticalScrollIndicator={false}>
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
                {formatPhone(user.phone, user.isPhoneCustom)}
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
                style={[styles.textCard, {color: primary}]}
                onPress={() =>
                  navigation.push('EditProfile', {
                    field: 'email',
                  })
                }>
                {t('btnTextAddEmail')}
              </MyText>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {contacts.map((c) => (
              <ContactBlock key={c.id} contact={c} />
            ))}
            <MyText
              style={{color: primary, marginBottom: sizes[10]}}
              onPress={() => navigation.push('Contact', {})}>
              {t('btnTextAddContact')}
            </MyText>
          </React.Fragment>
        )}
        {addresses.length > 0 && (
          <React.Fragment>
            <MyText style={[styles.text]}>{t('commonAddresses')}</MyText>
            {addresses.map((a) => {
              return <AddressBlock address={a} key={a.id} />;
            })}
          </React.Fragment>
        )}
        <MyText
          style={{color: primary}}
          onPress={() =>
            navigation.push('AddressNavigator', {
              screen: 'Address',
            })
          }>
          {t('btnTextAddAddress')}
        </MyText>
        <PressTitle
          style={styles.press}
          onPress={() => navigation.push('Certificate', {})}>
          {t('profileCertificate')}
        </PressTitle>
        {/* <PressTitle
          style={styles.press}
          onPress={() => navigation.push('LoyaltyCard', {})}>
          {t('profileLoyaltyCard')}
        </PressTitle>*/}
        {cards.length > 0 && (
          <React.Fragment>
            <MyText style={styles.text}>{t('commonCards')}</MyText>
            {cards.map((c) => (
              <CreditCardBlock card={c} />
            ))}
          </React.Fragment>
        )}
        <MyText
          style={[styles.textCard, {color: primary}]}
          onPress={handleAddCard}>
          {t('btnTextAddCard')}
        </MyText>
        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.btnExit, {backgroundColor: lightBackground}]}>
          <DesignIcon name={'log-out'} size={sizes[10]} fill={text} />
          <MyText style={{marginLeft: sizes[5]}}>{t('btnExit')}</MyText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    marginHorizontal: sizes[5],
    marginBottom: sizes[5],
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
    marginTop: sizes[10],
    paddingLeft: 0,
  },
  address: {
    paddingVertical: sizes[4],
    fontSize: sizes[9],
  },
  textCard: {
    marginBottom: sizes[16],
    marginTop: sizes[8],
  },
});

export default ProfileScreen;
