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

interface IDateInputProps {
  navigate: string;
}
const DateInput = ({navigate}: IDateInputProps) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<SecondStepScreenNavigationProp>();
  const {formatDate} = useFormattingContext();
  const date = useSelector(selectorsOrder.getDate);
  const time = useSelector(selectorsOrder.getTime);
  const idSellPoint = useSelector(selectorsOrder.getSellPointId);
  const deliveryType = useSelector(selectorsOrder.getDeliveryType);
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
            return service.getExcludeTime(d);
          }),
        );
        const obj = {};
        res.forEach((r) => {
          if (r.success) {
            obj[new Date(r.date!).toLocaleDateString()] = r.data;
            setExcludeTime(obj);
          }
        });
      } finally {
        setIsBlock(false);
      }
    };

    if (deliveryType && deliveryType!.code === TypeDelivery.courier) handle();
  }, [deliveryType]);

  useEffect(() => {
    const handle = async () => {
      const d = await service.getCurrentTime();
      if (isFocused) {
        console.log(d);
        const options = getOptions(settings, d, name === DEFAULT_NAME_SETTING);
        console.log(options);
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
    const filterOptions =
      deliveryType!.code === TypeDelivery.courier &&
      Object.keys(excludeTime).length > 0
        ? options.filter((opt) => {
            const times: string[] =
              excludeTime[new Date(opt.date).toLocaleDateString()];
            if (times && times.length === 0) {
              return true;
            }
            return times
              ? !times.some((e: any) => {
                  return opt.time === `${e.timeFrom} - ${e.timeTo}`;
                })
              : false;
          })
        : options;
    navigation.navigate('Date', {
      options: filterOptions,
      navigate,
    });
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
