import React, {useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {selectorsUser} from '../../../redux/user/userReducer';
import MyText from '../../controls/MyText';
import {FirstStepScreenProps} from '../../navigators/Order.navigator';
import MyButton from '../../controls/MyButton';
import {thunkGetTypes} from '../../../redux/types/typeReducer';
import {ScrollView} from 'react-native-gesture-handler';
import {getFontFamily} from '../../../utils/getFontFamily';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {actionsOrder, selectorsOrder} from '../../../redux/order/orderReducer';
import RadioBlock from '../../controls/RadioBlock';
import {IContact} from '../../../typings/FetchData';
import {actionsOther, selectorsOther} from '../../../redux/other/otherReducer';
import service from '../../../services/service';

const FirstStepScreen = React.memo(({navigation}: FirstStepScreenProps) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const {primary} = useTheme();
  const draftId = useSelector(selectorsOther.getDraftId);
  const mainClient = useSelector(selectorsUser.getDataUser)!;
  const contacts = useSelector(selectorsUser.getContacts);
  const contact = useSelector(selectorsOrder.getContact);

  const handleContinue = () => {
    navigation.push('SecondStep', {});
  };

  useEffect(() => {
    dispatch(thunkGetTypes);
    if (draftId === null) {
      service.createDraft().then((res) => {
        if (res.success) {
          dispatch(
            actionsOther.setData({
              draftId: res.data.id,
            }),
          );
        }
      });
    }
  }, []);

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
      <ScrollView style={styles.scroll}>
        <MyText style={styles.title}>Одержувач замовлення</MyText>
        <RadioBlock
          title={mainClient.name}
          onPress={() => handlePress(null)}
          isActive={contact === null}
          text={mainClient.phone}
        />
        <MyText
          style={[styles.addText, {color: primary}]}
          onPress={() => navigation.push('OrderContact', {})}>
          + Додати іншого одержувача замовлення
        </MyText>
        <MyText style={styles.title}>Збережені контакти</MyText>
        {contacts.map((c) => {
          return (
            <RadioBlock
              styleCon={styles.contact}
              title={`${c.firstName} ${c.lastName}`}
              text={c.phone}
              onPress={() => handlePress(c)}
              isActive={contact ? contact.id === c.id : false}
            />
          );
        })}
      </ScrollView>
      <View style={styles.bottom}>
        <MyButton styleText={styles.btnText} onPress={handleContinue}>
          продовжити
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
    paddingTop: sizes[12],
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
  },
});

export default FirstStepScreen;
