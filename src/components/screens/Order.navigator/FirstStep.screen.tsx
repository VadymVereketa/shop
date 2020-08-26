import React, {useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {selectorsUser} from '../../../redux/user/userReducer';
import MyText from '../../controls/MyText';
import {FirstStepScreenProps} from '../../navigators/Order.navigator';
import MyButton from '../../controls/MyButton';
import {thunkGetTypes} from '../../../redux/types/typeReducer';

const FirstStepScreen = React.memo(({navigation}: FirstStepScreenProps) => {
  const dispatch = useDispatch();
  const mainClient = useSelector(selectorsUser.getDataUser)!;

  const handleContinue = () => {
    navigation.push('SecondStep', {});
  };

  useEffect(() => {
    dispatch(thunkGetTypes);
  }, []);

  return (
    <View style={[styles.container]}>
      <MyText>Одержувач замовлення</MyText>
      <MyText>{mainClient.name}</MyText>
      <MyText>{mainClient.phone}</MyText>
      <MyButton onPress={handleContinue}>продовжити</MyButton>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FirstStepScreen;
