import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {CityScreenProps} from '../../navigators/Address.navigator';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import MyButton from '../../controls/MyButton';
import {sizes, useTheme} from '../../../context/ThemeContext';
import MyText from '../../controls/MyText';
import DesignIcon from '../../common/DesignIcon';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

const CityScreen = React.memo(({navigation, route}: CityScreenProps) => {
  const insets = useSafeAreaInsets();
  const {cities, city} = route.params;
  const {border, primary, text} = useTheme();
  const [value, setValue] = useState(city);
  const handleCancel = () => {
    navigation.goBack();
  };

  const handleOk = () => {
    navigation.navigate('Address', {
      city: value,
    });
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          marginTop: -insets.top,
        },
      ]}>
      <View>
        {cities.map((c) => {
          return (
            <TouchableWithoutFeedback
              onPress={() => setValue(c.value)}
              style={[styles.item, {borderBottomColor: border}]}>
              <MyText
                style={[
                  styles.btnText,
                  {color: value === c.value ? primary : text},
                ]}>
                {c.label}
              </MyText>
              {value === c.value && (
                <DesignIcon
                  name={'check-mark'}
                  size={sizes[10]}
                  fill={primary}
                />
              )}
            </TouchableWithoutFeedback>
          );
        })}
      </View>
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
          onPress={handleOk}
          containerStyle={styles.btn}
          styleText={styles.btnText}>
          Обрати
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
  btns: {
    flexDirection: 'row',
    marginHorizontal: -(sizes[5] / 2),
    marginBottom: sizes[5],
  },
  btnText: {
    fontSize: sizes[9],
  },
  btn: {
    marginHorizontal: sizes[5],
    flex: 1,
  },
  item: {
    borderBottomWidth: 1,
    paddingVertical: sizes[8],
    paddingHorizontal: sizes[10],
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default CityScreen;
