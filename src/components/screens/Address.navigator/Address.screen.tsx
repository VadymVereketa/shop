import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, Alert, Platform, Keyboard} from 'react-native';
import {AddressScreenProps} from '../../navigators/Address.navigator';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {sizes} from '../../../context/ThemeContext';
import {ScrollView} from 'react-native-gesture-handler';
import MyButton from '../../controls/MyButton';
import {useAxios} from '../../../useHooks/useAxios';
import service from '../../../services/service';
import {Controller, useForm} from 'react-hook-form';
import MyTextInput from '../../controls/MyTextInput';
import t from '../../../utils/translate';
import getErrorByObj from '../../../utils/getErrorByObj';
import validation from '../../../utils/validation';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import {IOption} from '../../../useHooks/useAvailableDate';
import MyText from '../../controls/MyText';
import {IExtra} from './Build.screen';
import {IAddressRedux} from '../../../typings/FetchData';
import {getConvertDataToFetch} from '../../../utils/formatAddress';
import {useDispatch} from 'react-redux';
import {actionsUser} from '../../../redux/user/userReducer';
import BlockButtons from '../../common/BlockButtons';

const cities = [
  {
    label: 'Київ',
    value: 1,
  },
  {
    label: 'Інше місто',
    value: 2,
  },
];

const AddressScreen = React.memo(({navigation, route}: AddressScreenProps) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const params = route.params || {};
  const paramCity = params.city;
  const paramStreet = params.street;
  const paramBuild = params.build;
  const paramAddress = params.address;

  const refTimer: any = useRef(-1);
  const [isShow, setIsShow] = useState(false);
  const [city, setCity] = useState(cities[0].value);
  const [street, setStreet] = useState(null as IOption<number> | null);
  const [build, setBuild] = useState(null as IOption<number, IExtra> | null);
  const {control, handleSubmit, errors, setValue, clearErrors} = useForm({
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: paramAddress as any,
  });
  const {request, isLoading} = useAxios(
    paramAddress ? service.updateAddress : service.addAddress,
  );
  const isOtherAddress = city !== cities[0].value;

  const handlePressBuild = () => {
    if (isOtherAddress) return;

    if (street === null) {
      if (refTimer.current !== -1) {
        clearTimeout(refTimer.current);
      }
      refTimer.current = setTimeout(() => {
        clearTimeout(refTimer.current);
        refTimer.current = -1;
        setIsShow(false);
      }, 5000);
      setIsShow(true);
    } else {
      navigation.push('Build', {
        street: street!,
      });
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleOk = async (data: IAddressRedux | any) => {
    if (isOtherAddress) {
      data.buildObj = null;
      data.streetObj = null;
    } else {
      if (data.street.trim().toLowerCase() === street!.label.toLowerCase()) {
        if (
          data.buildNumber.trim().toLowerCase() ===
          build!.extra!.build.toLowerCase()
        ) {
          data.buildObj = build;
          data.streetObj = street;
        }
      }
    }
    data.city = city;
    data.flatNumber = data.flatNumber === '' ? null : data.flatNumber;
    data.entrance = data.entrance === '' ? null : data.entrance;
    data.floor = data.floor === '' ? null : data.floor;
    const fetchData = getConvertDataToFetch(data);
    fetchData.id = paramAddress ? paramAddress.id : undefined;
    const res = await request(fetchData);
    if (res.success) {
      let address: any = res.data;
      address.addressDictionary = data.buildObj
        ? {
            district: {
              deliveryPrice: {
                id: data.buildObj.extra.idDeliveryPrice,
              },
            },
          }
        : null;
      paramAddress
        ? dispatch(actionsUser.updateAddress(address))
        : dispatch(actionsUser.addAddress(address));
      navigation.goBack();
    }
  };

  useEffect(() => {
    const handle = async () => {
      try {
        if (paramAddress) {
          let res = await service.getStreets(paramAddress.street.trim());
          if (res.success) {
            const s = res.data.find(
              (d) => d.name === paramAddress.street.trim(),
            );
            if (s) {
              setStreet({label: s.name, value: s.id});
              res = await service.getAddressesByStrees(s.id);
              if (res.success) {
                const b = res.data.find((d) => {
                  return (
                    d.buildNumber === paramAddress.buildNumber &&
                    d.district.name === paramAddress.district
                  );
                });
                setBuild({
                  value: b.id,
                  label: `${b.buildNumber} ${b.district.name}`,
                  extra: {
                    build: b.buildNumber,
                    idDeliveryPrice: b.district.deliveryPrice.id,
                    idDistrict: b.district.id,
                    name: b.district.name,
                  },
                });
                return;
              }
            }
          }
        } else {
          return;
        }
      } catch (e) {}
      setCity(cities[1].value);
      setValue('district', paramAddress!.district);
    };
    handle();
  }, [paramAddress]);

  useDidUpdateEffect(() => {}, [city]);

  useDidUpdateEffect(() => {
    if (paramCity) {
      setCity(paramCity);
    }
  }, [paramCity]);

  useDidUpdateEffect(() => {
    if (paramStreet) {
      setStreet(paramStreet);
      setValue('street', paramStreet.label);
      clearErrors('street');
    }
  }, [paramStreet]);

  useDidUpdateEffect(() => {
    if (paramBuild) {
      setBuild(paramBuild);
      setValue('buildNumber', paramBuild.extra!.build);
      clearErrors('buildNumber');
    }
  }, [paramBuild]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          marginTop: -insets.top,
        },
      ]}>
      <ScrollView
        style={{flex: 1, paddingTop: sizes[5]}}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.btns}>
          <MyTextInput
            viewOnTouch={() => {
              navigation.push('City', {
                cities,
                city,
              });
            }}
            styleCon={styles.input}
            afterIcon={{
              name: 'map',
              onPress: () => null,
              isStroke: true,
            }}
            value={cities.find((c) => c.value === city)!.label}
            editable={false}
          />
          {isOtherAddress && (
            <Controller
              control={control}
              render={({onChange, onBlur, value}) => (
                <MyTextInput
                  styleCon={[styles.input, {flexGrow: 2}]}
                  placeholder={t('tiCityPlaceholder')}
                  keyboardType={'default'}
                  textContentType={'addressCity'}
                  value={value}
                  onChangeText={onChange}
                  error={getErrorByObj(errors, 'district')}
                />
              )}
              name="district"
              rules={validation.required}
            />
          )}
        </View>
        <Controller
          control={control}
          render={({onChange, onBlur, value}) => (
            <MyTextInput
              viewOnTouch={() => {
                if (isOtherAddress) return;
                navigation.push('Street', {});
              }}
              editable={isOtherAddress}
              styleCon={[
                styles.inputText,
                {
                  paddingBottom: sizes[8],
                },
              ]}
              placeholder={t('tiStreetPlaceholder')}
              keyboardType={'default'}
              textContentType={'addressCity'}
              value={value}
              onChangeText={onChange}
              error={getErrorByObj(errors, 'street')}
            />
          )}
          name="street"
          rules={validation.required}
        />
        <View style={styles.btns}>
          <Controller
            control={control}
            render={({onChange, onBlur, value}) => (
              <MyTextInput
                viewOnTouch={handlePressBuild}
                editable={isOtherAddress}
                styleCon={styles.input}
                placeholder={t('tiBuildPlaceholder')}
                keyboardType={'default'}
                textContentType={'addressState'}
                value={value}
                onChangeText={onChange}
                error={getErrorByObj(errors, 'buildNumber')}
              />
            )}
            name="buildNumber"
            rules={validation.required}
          />
          <Controller
            control={control}
            render={({onChange, onBlur, value}) => (
              <MyTextInput
                styleCon={styles.input}
                placeholder={t('tiFlatPlaceholder')}
                keyboardType={'numeric'}
                textContentType={'none'}
                value={value}
                onChangeText={onChange}
                error={getErrorByObj(errors, 'flatNumber')}
              />
            )}
            name="flatNumber"
            rules={validation.onlyNumber}
            defaultValue={''}
          />
        </View>
        <View style={styles.btns}>
          <Controller
            control={control}
            render={({onChange, onBlur, value}) => (
              <MyTextInput
                styleCon={styles.input}
                placeholder={t('tiEntrancePlaceholder')}
                keyboardType={'numeric'}
                textContentType={'none'}
                value={value}
                onChangeText={onChange}
                error={getErrorByObj(errors, 'entrance')}
              />
            )}
            name="entrance"
            rules={validation.onlyNumber}
            defaultValue={''}
          />
          <Controller
            control={control}
            render={({onChange, onBlur, value}) => (
              <MyTextInput
                styleCon={styles.input}
                placeholder={t('tiFloorPlaceholder')}
                keyboardType={'numeric'}
                textContentType={'none'}
                value={value}
                onChangeText={onChange}
                error={getErrorByObj(errors, 'floor')}
              />
            )}
            name="floor"
            rules={validation.onlyNumber}
            defaultValue={''}
          />
        </View>
        {isShow && (
          <MyText>
            {t('textErrorStreet')} {t('tiStreetPlaceholder')}
          </MyText>
        )}
      </ScrollView>
      <BlockButtons
        isLoading={isLoading}
        onOk={handleSubmit(handleOk)}
        onCancel={handleCancel}
        textCancel={t('btnCancel')}
        textOk={t('btnSave')}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    marginHorizontal: sizes[5],
    justifyContent: 'space-between',
    flex: 1,
  },
  btns: {
    flexDirection: 'row',
    marginHorizontal: -(sizes[5] / 2),
    marginBottom: sizes[5],
  },
  inputText: {
    marginBottom: sizes[5],
  },
  input: {
    flexGrow: 1,
    marginHorizontal: sizes[5] / 2,
    paddingBottom: sizes[8],
  },
});

export default AddressScreen;
