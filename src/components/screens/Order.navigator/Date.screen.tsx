import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import MyButton from '../../controls/MyButton';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {FlatList} from 'react-native-gesture-handler';
import MyText from '../../controls/MyText';
import {useFormattingContext} from '../../../context/FormattingContext';
import {getFontFamily} from '../../../utils/getFontFamily';
import {DateScreenProps} from '../../navigators/Order.navigator';
import DesignIcon from '../../common/DesignIcon';
import {useSelector} from 'react-redux';
import {selectorsOrder} from '../../../redux/order/orderReducer';

export interface IOptionDate {
  value: number;
  date: Date;
  time: string;
}

const DateScreen = ({navigation, route}: DateScreenProps) => {
  const insets = useSafeAreaInsets();
  const {formatDate} = useFormattingContext();
  const {border, primary} = useTheme();
  const [value, setValue] = useState(-1);
  const date = useSelector(selectorsOrder.getDate);
  const time = useSelector(selectorsOrder.getTime);
  const options = route.params.options;

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleOk = () => {
    navigation.navigate('SecondStep', {
      option: options.find((o) => o.value === value)!,
    });
  };

  useEffect(() => {
    if (!date) return;

    const item = options.find((o) => {
      return (
        o.date.toLocaleString() === date!.toLocaleString() && o.time === time
      );
    });
    if (item) {
      setValue(item.value);
    }
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          marginTop: -insets.top,
        },
      ]}>
      <FlatList
        data={options}
        keyExtractor={(item) => item.value.toString()}
        renderItem={(info) => {
          const {item} = info;
          return (
            <TouchableWithoutFeedback
              onPress={() => setValue(item.value)}
              style={{
                padding: sizes[8],
                borderBottomWidth: 1,
                borderBottomColor: border,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <MyText style={{fontSize: sizes[9]}}>
                <MyText
                  style={{
                    fontFamily: getFontFamily('500'),
                  }}>
                  {formatDate(item.date) + ' '}
                </MyText>
                {info.item.time}
              </MyText>
              {value === item.value && (
                <DesignIcon
                  name={'check-mark'}
                  size={sizes[10]}
                  fill={primary}
                />
              )}
            </TouchableWithoutFeedback>
          );
        }}
      />
      <View style={styles.btns}>
        <MyButton
          onPress={handleCancel}
          type={'default'}
          containerStyle={styles.btn}
          isActive
          styleText={styles.btnText}>
          скасувати
        </MyButton>
        <MyButton
          disabled={value === -1}
          onPress={handleOk}
          containerStyle={styles.btn}
          styleText={styles.btnText}>
          Обрати
        </MyButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: sizes[5],
  },
  btns: {
    flexDirection: 'row',
    marginHorizontal: -(sizes[5] / 2),
    marginBottom: sizes[5],
    paddingTop: sizes[5],
  },
  btnText: {
    fontSize: sizes[9],
  },
  btn: {
    marginHorizontal: sizes[5],
    flex: 1,
  },
});

export default DateScreen;
