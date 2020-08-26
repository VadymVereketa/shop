import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {selectorsOther} from '../../../redux/other/otherReducer';
import {DEFAULT_NAME_SETTING} from '../../../constants/constantsId';

interface IOption {
  value: number;
  date: Date;
  time: string;
}
interface ISetting {
  step: number;
  offset: number;
  from: string;
  to: string;
}

const compareTimes = (d1: Date, d2: Date) => {
  return d1.getTime() < d2.getTime();
};

const getOptions = ({from, offset, step, to}: ISetting, isRange = false) => {};

const DateScreen = (props: any) => {
  const setting = useSelector(selectorsOther.getSetting(DEFAULT_NAME_SETTING));

  return (
    <View style={[styles.container]}>
      <Text>DateScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DateScreen;
