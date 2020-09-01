import React, {useState} from 'react';
import {View, StyleSheet, Text, Keyboard} from 'react-native';
import {StreetScreenProps} from '../../navigators/Address.navigator';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {sizes, useTheme} from '../../../context/ThemeContext';
import MyTextInput from '../../controls/MyTextInput';
import {ScrollView} from 'react-native-gesture-handler';
import MyText from '../../controls/MyText';
import {useAxios} from '../../../useHooks/useAxios';
import service from '../../../services/service';
import {IOption} from '../../../useHooks/useAvailableDate';
import DesignIcon from '../../common/DesignIcon';
import MyButton from '../../controls/MyButton';

const StreetScreen = React.memo(({navigation, route}: StreetScreenProps) => {
  const insets = useSafeAreaInsets();
  const {border, primary, text, background} = useTheme();
  const {request: getStreets} = useAxios(service.getStreets);
  const [value, setValue] = useState('');
  const [selected, setSelected] = useState(-1);
  const [streets, setStreets] = useState([] as IOption<number>[]);

  const handleSearch = async () => {
    Keyboard.dismiss();
    const res = await getStreets<{id: number; name: string}[]>(value);
    if (res.success) {
      setStreets(res.data.map((d) => ({label: d.name, value: d.id})));
    }
  };

  const handleFocus = () => {
    setSelected(-1);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleOk = () => {
    navigation.navigate('Address', {
      street: streets.find((s) => s.value === selected)!,
    });
  };

  const preValue =
    selected === -1 ? null : streets.find((s) => s.value === selected)!.label;

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          marginTop: -insets.top,
        },
      ]}>
      <View style={[styles.top, {backgroundColor: background}]}>
        <MyTextInput
          autoFocus
          onFocus={handleFocus}
          onClear={handleFocus}
          value={preValue ? preValue : value}
          onChangeText={(text) => setValue(text)}
          onSubmitEditing={handleSearch}
          isClear
          afterIcon={{
            name: 'search',
            onPress: handleSearch,
          }}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {streets.map((s) => {
          return (
            <View
              key={s.value}
              style={[styles.item, {borderBottomColor: border}]}>
              <MyText
                style={[
                  styles.text,
                  {color: selected === s.value ? primary : text},
                ]}
                onPress={() => setSelected(s.value)}>
                {s.label}
              </MyText>
              {selected === s.value && (
                <DesignIcon
                  name={'check-mark'}
                  size={sizes[10]}
                  fill={primary}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
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
          disabled={selected === -1}
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
    marginHorizontal: sizes[5],
  },
  top: {
    paddingVertical: sizes[8],
    paddingHorizontal: sizes[5],
    marginHorizontal: -sizes[5],

    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    elevation: 4,
  },
  item: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: sizes[10],
  },
  text: {
    fontSize: sizes[9],
    paddingVertical: sizes[8],
    paddingLeft: sizes[10],
    flexGrow: 1,
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
});

export default StreetScreen;
