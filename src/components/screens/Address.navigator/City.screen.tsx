import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {CityScreenProps} from '../../navigators/Address.navigator';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import MyButton from '../../controls/MyButton';
import {sizes, useTheme} from '../../../context/ThemeContext';
import MyText from '../../controls/MyText';
import DesignIcon from '../../common/DesignIcon';
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import BlockButtons from '../../common/BlockButtons';
import t from '../../../utils/translate';

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
      <BlockButtons
        isLoading={false}
        onOk={handleOk}
        onCancel={handleCancel}
        textCancel={t('btnCancel')}
        textOk={t('btnSelect')}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: sizes[5],
  },
  btnText: {
    fontSize: sizes[9],
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
