import React, {useEffect, useMemo, useState} from 'react';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import MyText from '../controls/MyText';
import MyTextInput from '../controls/MyTextInput';
import {getFontFamily} from '../../utils/getFontFamily';
import {sizes} from '../../context/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {actionsOrder, selectorsOrder} from '../../redux/order/orderReducer';
import {useFormattingContext} from '../../context/FormattingContext';
import {SecondStepScreenNavigationProp} from '../navigators/Order.navigator';
import {DEFAULT_NAME_SETTING, TypeDelivery} from '../../constants/constantsId';
import {selectorsOther} from '../../redux/other/otherReducer';
import getOptions from '../../utils/getOptionsDate';
import {IOptionDate} from '../screens/Order.navigator/Date.screen';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import t from '../../utils/translate';
import service from '../../services/service';
import {SelectorCity} from '../../redux/city/cityReducer';

interface IDateInputProps {
  navigate: string;
}

const strToTime = (str: string) => {
  const [h, m] = str.split(':').map(parseFloat);
  return h * 60 + m;
};

const consistInRange = (
  from: string,
  to: string,
  value: string,
  isFirst?: boolean,
) => {
  const fromTime = strToTime(from);
  const toTime = strToTime(to);
  const valueTime = strToTime(value);

  if (isFirst === undefined) {
    return valueTime >= fromTime && valueTime <= toTime;
  }
  if (isFirst) {
    return valueTime > fromTime && valueTime <= toTime;
  } else {
    return valueTime >= fromTime && valueTime < toTime;
  }
};

const DateInput = ({navigate}: IDateInputProps) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<SecondStepScreenNavigationProp>();
  const {formatDate} = useFormattingContext();
  const date = useSelector(selectorsOrder.getDate);
  const time = useSelector(selectorsOrder.getTime);
  const idSellPoint = useSelector(selectorsOrder.getSellPointId);
  const deliveryType = useSelector(selectorsOrder.getDeliveryType);
  const selectedCity = useSelector(SelectorCity.getSelectedCity);
  const name = useMemo(() => {
    return deliveryType === null
      ? DEFAULT_NAME_SETTING
      : deliveryType.code === TypeDelivery.courier
      ? DEFAULT_NAME_SETTING
      : idSellPoint === null
      ? DEFAULT_NAME_SETTING
      : idSellPoint;
  }, [idSellPoint, deliveryType]);
  const settings = useSelector(selectorsOther.getSetting(name));
  const [options, setOptions] = useState([] as IOptionDate[]);
  const [excludeTime, setExcludeTime] = useState({} as any);
  const [isBlock, setIsBlock] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    const handle = async () => {
      setIsBlock(true);
      try {
        const res = await Promise.all(
          [0, 1, 2, 3, 4, 5, 6].map((i) => {
            const d = new Date();
            d.setDate(d.getDate() + i);
            return name === DEFAULT_NAME_SETTING
              ? service.getExcludeTime(d)
              : service.getExcludeTimeSellPoint(d, name);
          }),
        );
        const obj = {};
        res.forEach((r) => {
          if (r.success) {
            obj[new Date(r.date!).toLocaleDateString()] = r.data;
          }
        });
        setExcludeTime(obj);
      } finally {
        setIsBlock(false);
      }
    };

    //TODO: delete
    if (deliveryType!.code === TypeDelivery.courier && selectedCity !== null) {
      if (selectedCity.id !== 1) {
        return;
      }
    }

    if (deliveryType) {
      handle();
    }
  }, [deliveryType, name]);

  useEffect(() => {
    const handle = async () => {
      const d = await service.getCurrentTime();
      if (isFocused) {
        const options = getOptions(settings, d, name === DEFAULT_NAME_SETTING);

        setOptions(options);
      }
    };
    handle();
  }, [settings.from, settings.to, name, isFocused]);

  useDidUpdateEffect(() => {
    if (deliveryType) {
      dispatch(
        actionsOrder.setData({
          date: null,
          time: '',
        }),
      );
    }
  }, [deliveryType]);

  const handlePressDate = () => {
    if (isBlock) {
      return;
    }
    //TODO: delete
    if (deliveryType!.code === TypeDelivery.courier && selectedCity !== null) {
      if (selectedCity.id !== 1) {
        navigation.navigate('Date', {
          options,
          navigate,
        });
        return;
      }
    }

    if (Object.keys(excludeTime).length > 0) {
      const filterOptions = options.filter((opt) => {
        const times: string[] =
          excludeTime[new Date(opt.date).toLocaleDateString()];
        if (times && times.length === 0) {
          return true;
        }
        return times
          ? !times.some((e: any) => {
              if (name === DEFAULT_NAME_SETTING) {
                const [from, to] = opt.time.split(' - ');
                return (
                  consistInRange(e.timeFrom, e.timeTo, from, false) ||
                  consistInRange(e.timeFrom, e.timeTo, to, true)
                );
              } else {
                const [value] = opt.time.split(' - ');
                return consistInRange(e.timeFrom, e.timeTo, value);
              }
            })
          : false;
      });

      navigation.navigate('Date', {
        options: filterOptions,
        navigate,
      });
    } else {
      navigation.navigate('Date', {
        options,
        navigate,
      });
    }
  };

  if (deliveryType === null) return null;
  if (deliveryType.code === TypeDelivery.self && idSellPoint === null)
    return null;

  return (
    <View>
      <MyText style={styles.text}>
        {deliveryType.code === TypeDelivery.self
          ? t('commonDateTime')
          : t('orderTitleDate')}
      </MyText>
      <MyTextInput
        editable={false}
        viewOnTouch={handlePressDate}
        placeholder={t('orderSelectDate')}
        afterIcon={{
          onPress: () => null,
          name: 'arrow-down',
        }}
        value={`${date ? formatDate(date) : ''} ${time}`.trim()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: getFontFamily('500'),
    marginTop: sizes[5],
    marginBottom: sizes[8],
  },
});
export default DateInput;
