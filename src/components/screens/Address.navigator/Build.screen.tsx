import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Keyboard} from 'react-native';
import {BuildScreenProps} from '../../navigators/Address.navigator';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {sizes, useTheme} from '../../../context/ThemeContext';
import MyTextInput from '../../controls/MyTextInput';
import {FlatList} from 'react-native-gesture-handler';
import {IOption} from '../../../useHooks/useAvailableDate';
import {IAddressDictionary} from '../../../typings/FetchData';
import {useAxios} from '../../../useHooks/useAxios';
import service from '../../../services/service';
import {useSelector} from 'react-redux';
import BlockButtons from '../../common/BlockButtons';
import OptionItem from '../../common/OptionItem';
import t from '../../../utils/translate';
import {SelectorCity} from '../../../redux/city/cityReducer';

export interface IExtra {
  build: string;
  idDeliveryPrice: number;
  idDistrict: number;
  name: string;
}
const BuildScreen = React.memo(({navigation, route}: BuildScreenProps) => {
  const insets = useSafeAreaInsets();
  const isDefaultDeliveryPrice = useSelector(SelectorCity.getIdDeliveryPrice);
  const {request} = useAxios(service.getAddressesByStrees);
  const {background} = useTheme();
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
        renderItem={(info) => (
          <OptionItem
            info={info}
            selected={selected}
            setSelected={setSelected}
          />
        )}
      />
      <BlockButtons
        isLoading={false}
        disabled={selected === -1}
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
});

export default BuildScreen;
