import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Keyboard} from 'react-native';
import {BuildScreenProps} from '../../navigators/Address.navigator';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {sizes, useTheme} from '../../../context/ThemeContext';
import MyTextInput from '../../controls/MyTextInput';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import MyButton from '../../controls/MyButton';
import {IOption} from '../../../useHooks/useAvailableDate';
import {IAddressDictionary} from '../../../typings/FetchData';
import {useAxios} from '../../../useHooks/useAxios';
import service from '../../../services/service';
import {useSelector} from 'react-redux';
import {selectorsOther} from '../../../redux/other/otherReducer';
import MyText from '../../controls/MyText';
import DesignIcon from '../../common/DesignIcon';

export interface IExtra {
  build: string;
  idDeliveryPrice: number;
  idDistrict: number;
  name: string;
}
const BuildScreen = React.memo(({navigation, route}: BuildScreenProps) => {
  const insets = useSafeAreaInsets();
  const isDefaultDeliveryPrice = useSelector(selectorsOther.getIdDeliveryPrice);
  const {request} = useAxios(service.getAddressesByStrees);
  const {border, primary, text, background} = useTheme();
  const [value, setValue] = useState('');
  const [builds, setBuilds] = useState([] as IOption<number, IExtra>[]);
  const [selected, setSelected] = useState(-1);

  useEffect(() => {
    request<IAddressDictionary[]>(route.params.street.value).then((res) => {
      if (res.success) {
        const obj: any = {};
        res.data.forEach((d) => {
          if (obj[d.buildNumber]) {
            obj[d.buildNumber].disctrics.push({
              id: d.district.id,
              name: d.district.name,
              buildId: d.id,
              idDeliveryPrice: d.district.deliveryPrice
                ? d.district.deliveryPrice.id
                : isDefaultDeliveryPrice,
            });
          } else {
            obj[d.buildNumber] = {
              buildNumber: d.buildNumber,
              disctrics: [
                {
                  id: d.district.id,
                  name: d.district.name,
                  buildId: d.id,
                  idDeliveryPrice: d.district.deliveryPrice
                    ? d.district.deliveryPrice.id
                    : isDefaultDeliveryPrice,
                },
              ],
            };
          }
        });
        const builds: any[] = [];
        Object.values(obj).forEach((d: any) => {
          if (d.disctrics.length > 1) {
            for (let disctric of d.disctrics) {
              builds.push({
                value: disctric.buildId,
                label: `${d.buildNumber} (${disctric.name})`,
                extra: {
                  idDistrict: disctric.id,
                  name: disctric.name,
                  build: d.buildNumber,
                  idDeliveryPrice: disctric.idDeliveryPrice,
                },
              });
            }
          } else {
            builds.push({
              value: d.disctrics[0].buildId,
              label: d.buildNumber,
              extra: {
                idDistrict: d.disctrics[0].id,
                name: d.disctrics[0].name,
                build: d.buildNumber,
                idDeliveryPrice: d.disctrics[0].idDeliveryPrice,
              },
            });
          }
        });
        setBuilds(builds);
      }
    });
  }, []);

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleOk = () => {
    navigation.navigate('Address', {
      build: builds.find((b) => b.value === selected)!,
    });
  };

  const handleSearch = async () => {
    Keyboard.dismiss();
  };

  const filterBuilds = builds.filter(
    (b) => b.label.toLowerCase().indexOf(value.toLowerCase()) !== -1,
  );
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
          value={value}
          onChangeText={(text) => setValue(text)}
          onSubmitEditing={handleSearch}
          isClear
          afterIcon={{
            name: 'search',
            onPress: handleSearch,
          }}
        />
      </View>
      <FlatList
        data={filterBuilds}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.value.toString()}
        renderItem={(info) => {
          const item = info.item;
          return (
            <View
              key={item.value}
              style={[styles.item, {borderBottomColor: border}]}>
              <MyText
                style={[
                  styles.text,
                  {color: selected === item.value ? primary : text},
                ]}
                onPress={() => setSelected(item.value)}>
                {item.label}
              </MyText>
              {selected === item.value && (
                <DesignIcon
                  name={'check-mark'}
                  size={sizes[10]}
                  fill={primary}
                />
              )}
            </View>
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

export default BuildScreen;
