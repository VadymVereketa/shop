import React, {useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {selectorsUser} from '../../../redux/user/userReducer';
import MyText from '../../controls/MyText';
import {FirstStepScreenProps} from '../../navigators/Order.navigator';
import MyButton from '../../controls/MyButton';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {getFontFamily} from '../../../utils/getFontFamily';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {actionsOrder, selectorsOrder} from '../../../redux/order/orderReducer';
import RadioBlock from '../../controls/RadioBlock';
import {IContact} from '../../../typings/FetchData';
import t from '../../../utils/translate';
import useSaveDraft from '../../../useHooks/useSaveDraft';
import {actionsOther} from '../../../redux/other/otherReducer';

const FirstStepScreen = React.memo(({navigation}: FirstStepScreenProps) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const {primary, border} = useTheme();
  const mainClient = useSelector(selectorsUser.getDataUser)!;
  const contacts = useSelector(selectorsUser.getContacts);
  const contact = useSelector(selectorsOrder.getContact);
  const saveDraft = useSaveDraft();

  const handleContinue = () => {
    saveDraft();
    navigation.push('SecondStep', {});
  };

  const handlePress = (c: IContact | null) => {
    dispatch(
      actionsOrder.setData({
        contact: c,
      }),
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          marginTop: -insets.top,
        },
      ]}>
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <MyText style={styles.title}>{t('orderTitleReceiver')}</MyText>
        <TouchableOpacity
          style={[
            styles.block,
            {borderColor: contact === null ? primary : border},
          ]}
          onPress={() => handlePress(null)}>
          <MyText style={[styles.text, styles.name]}>{mainClient.name}</MyText>
          <MyText style={[styles.text]}>{mainClient.phone}</MyText>
        </TouchableOpacity>
        <MyText
          style={[styles.addText, {color: primary}]}
          onPress={() => navigation.push('OrderContact', {})}>
          {t('btnTextAddReceiver')}
        </MyText>
        {contacts.length > 0 && (
          <MyText style={styles.title}>{t('profileSaveContacts')}</MyText>
        )}
        {contacts.map((c) => {
          return (
            <TouchableOpacity
              style={[
                styles.block,
                {
                  borderColor:
                    contact && contact.id === c.id ? primary : border,
                },
              ]}
              onPress={() => handlePress(c)}>
              <MyText
                style={[
                  styles.text,
                  styles.name,
                ]}>{`${c.firstName} ${c.lastName}`}</MyText>
              <MyText style={[styles.text]}>{c.phone}</MyText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.bottom}>
        <MyButton styleText={styles.btnText} onPress={handleContinue}>
          {t('btnContinue')}
        </MyButton>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: sizes[5],
  },
  scroll: {
    paddingTop: sizes[10],
  },
  title: {
    fontFamily: getFontFamily('500'),
    marginBottom: sizes[8],
  },
  btnText: {
    fontSize: sizes[9],
  },
  addText: {
    marginTop: sizes[8],
    marginBottom: sizes[15],
  },
  contact: {
    marginBottom: sizes[5],
  },
  bottom: {
    marginBottom: sizes[5],
    marginTop: sizes[5],
  },
  block: {
    borderWidth: 1,
    paddingVertical: sizes[8],
    paddingHorizontal: sizes[8],
    marginBottom: sizes[5],
  },
  name: {
    marginBottom: sizes[8],
  },
  text: {
    fontSize: sizes[9],
    fontFamily: getFontFamily('500'),
  },
});

export default FirstStepScreen;
