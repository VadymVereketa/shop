import React, {useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Slider} from '@miblanchard/react-native-slider';
import {sizes, useTheme} from '../../context/ThemeContext';
import MyText from '../controls/MyText';
import {getFontFamily} from '../../utils/getFontFamily';
import {useDispatch, useSelector} from 'react-redux';
import {useFormattingContext} from '../../context/FormattingContext';
import {actionsCart, selectorsCart} from '../../redux/cart/cartReducer';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import CountInput from '../controls/CountInput';
import {
  responsiveWidth,
  useResponsiveWidth,
} from 'react-native-responsive-dimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MyButton from '../controls/MyButton';
import t from '../../utils/translate';
import {ITranslate} from '../../assets/translations/uk';
import {Switch} from 'react-native-gesture-handler';
import {selectorsOrder} from '../../redux/order/orderReducer';
import {selectorsUser} from '../../redux/user/userReducer';

interface IWeightUnitProps {
  id: number;
  price: number;
  addToCart: (count: number, alternativeCount: number | null) => any;
  title: ITranslate;
  avgWeight: string | null;
  onOrder: () => any;
}

const LENGTH_SLIDER = 1.2;
const ABROAD = 0.2;

const calc = (current: number) => {
  if (current < LENGTH_SLIDER - ABROAD) {
    return {
      min: 0.1,
      max: LENGTH_SLIDER,
      current: 3,
      step: 0.1,
      prev: 0.1,
      next: LENGTH_SLIDER - ABROAD,
    };
  }
  let min = current - LENGTH_SLIDER / 2; //11  //1
  min = min < 0.1 ? 0.1 : min;
  let max = current + LENGTH_SLIDER / 2; //31 //20
  max = max > 100 ? 100 : max;

  return {
    min,
    max,
    current,
    step: 0.1,
    prev: min !== 0.1 ? min + ABROAD : 0.1,
    next: max !== 100 ? max - ABROAD : 100,
  };
};

const WeightUnit = React.memo(
  ({id, price, addToCart, title, avgWeight, onOrder}: IWeightUnitProps) => {
    const w = useResponsiveWidth(100);
    const insets = useSafeAreaInsets();
    const {
      primary,
      lightBackground,
      background,
      lightText,
      border,
      text,
    } = useTheme();
    const dispatch = useDispatch();
    const isAuth = useSelector(selectorsUser.isAuth);
    const isAvgWeight = !!avgWeight;
    const isRepeatOrder = useSelector(selectorsOrder.isRepeatOrder);
    const {formatPrice, currentLocale, format1000Unit} = useFormattingContext();
    const alternativeCount = useSelector(
      selectorsCart.getAlternativeCountProduct(id),
    );
    const [isAlternativeCount, setIsAlternativeCount] = useState(
      alternativeCount !== null,
    ); //null = false
    let initValue = useSelector(selectorsCart.getCountProduct(id));
    const [firstLoad, setFirstLoad] = useState(initValue === null);
    const [weight, setWeight] = useState(initValue !== null ? +initValue : 1);
    const [config, setConfig] = useState(calc(weight));
    const marks = useMemo(() => {
      const {max, min} = config;
      let step = (max - min) / (w / 120);
      step = +step.toFixed(1);
      const res: any[] = [];
      for (let i = min; i <= max; i += step) {
        const j = +i.toFixed(1);
        res.push(j);
      }
      res.push(max);
      return res;
    }, [config, currentLocale, w]);

    const onChangeCount = (n) => {
      setWeight(n);
      handleAfterChange(n);
    };
    const onChangeAlternativeCount = (n) => {
      setWeight(n);
      dispatch(
        actionsCart.changeAlternativeCount({
          id,
          count: n,
        }),
      );
    };

    const onChangeSlider = (n) => {
      setWeight(n);
    };

    const handleSubmit = async () => {
      if (!isAuth) {
        return;
      }
      if (isAlternativeCount) {
        addToCart(weight * +avgWeight!, weight);
      } else {
        addToCart(
          weight,
          avgWeight !== null ? Math.round(weight / +avgWeight!) : null,
        );
        if (avgWeight !== null) {
          setIsAlternativeCount(true);
        }
      }
    };

    const handleOrder = async () => {
      await handleSubmit();
      onOrder();
    };

    const handleAfterChange = (newValue) => {
      if (newValue >= config.next) {
        setConfig(calc(newValue));
      } else if (config.prev !== 0.1 && newValue <= config.prev) {
        setConfig(calc(newValue <= 0.1 ? 0.1 : newValue));
      }
      dispatch(
        actionsCart.changeCount({
          id,
          count: newValue,
        }),
      );
    };

    useDidUpdateEffect(() => {
      if (initValue !== null && firstLoad) {
        setWeight(initValue);
        setConfig(calc(initValue));
        setFirstLoad(false);
        if (alternativeCount === null) {
          setIsAlternativeCount(false);
        } else {
          setIsAlternativeCount(true);
        }
      } else {
        if (initValue !== null) setWeight(initValue);
      }
    }, [initValue, firstLoad, alternativeCount]);

    const handleChangeCount = () => {
      if (!isAlternativeCount) {
        const altCount = Math.round(weight / +avgWeight!);
        onChangeAlternativeCount(altCount === 0 ? 1 : altCount);
      } else {
        onChangeCount(weight * +avgWeight!);
        dispatch(
          actionsCart.changeAlternativeCount({
            id,
            count: null,
          }),
        );
      }
      setIsAlternativeCount((a) => !a);
    };

    return (
      <View style={styles.con}>
        {isAvgWeight && (
          <View style={[styles.viewSwitch, {borderColor: border}]}>
            <MyText style={styles.titleSwitch}>{t('commonSettings')}</MyText>
            <MyText
              style={[
                styles.textSwitch,
                {color: isAlternativeCount ? text : primary},
              ]}>
              {t('commonWeight')}
            </MyText>
            <Switch
              trackColor={{false: primary, true: primary}}
              thumbColor={'white'}
              ios_backgroundColor={primary}
              onValueChange={handleChangeCount}
              value={isAlternativeCount}
              style={{marginHorizontal: sizes[10]}}
            />
            <MyText
              style={[
                styles.textSwitch,
                {color: isAlternativeCount ? primary : text},
              ]}>
              {t('commonUnit')}
            </MyText>
          </View>
        )}
        <View style={styles.viewCount}>
          <MyText style={[styles.price]}>{formatPrice(+price * weight)}</MyText>
          <CountInput
            isEditable={true}
            isWeightUnit={!isAlternativeCount}
            onChange={
              isAlternativeCount ? onChangeAlternativeCount : onChangeCount
            }
            value={weight}
            style={{
              maxWidth: w / 2,
            }}
          />
        </View>
        {!isAlternativeCount && (
          <Slider
            animationType={'spring'}
            animateTransitions={true}
            step={0.1}
            trackClickable={false}
            minimumValue={config.min}
            maximumValue={config.max}
            value={weight}
            renderThumbComponent={() => {
              return (
                <View
                  style={[
                    styles.circleBorder,
                    {
                      borderColor: background,
                    },
                  ]}>
                  <View
                    style={[
                      styles.circle,
                      {
                        backgroundColor: primary,
                      },
                    ]}
                  />
                </View>
              );
            }}
            containerStyle={styles.conSlider}
            minimumTrackTintColor={primary}
            trackStyle={{
              backgroundColor: lightBackground,
            }}
            onSlidingComplete={(value1) => {
              handleAfterChange(value1[0]);
            }}
            onValueChange={(value) => {
              onChangeSlider(value[0]);
            }}
          />
        )}
        {!isAlternativeCount && (
          <View style={styles.viewMarks}>
            {marks.map((m, i) => {
              const width = w - sizes[28] - insets.left - insets.right;
              const y = ((m - config.min) * 100) / (config.max - config.min);
              const left = (y * width) / 100;
              return (
                <MyText
                  key={i}
                  style={[
                    styles.mark,
                    {
                      color: lightText,
                      left,
                    },
                  ]}>
                  {format1000Unit(m)}
                </MyText>
              );
            })}
          </View>
        )}
        {!isRepeatOrder && (
          <MyButton
            styleText={styles.btnText}
            style={styles.btnTop}
            onPress={handleOrder}>
            {t('btnOrderLong')}
          </MyButton>
        )}
        <MyButton
          styleText={styles.btnText}
          type={'default'}
          isActive
          onPress={handleSubmit}>
          {t(title)}
        </MyButton>
        <MyText style={styles.textInfo}>{t('productInfo')}</MyText>
        <MyText style={styles.textDesc}>
          {t('productDesc', {weight: format1000Unit(weight)})}
        </MyText>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  con: {
    paddingTop: sizes[8],
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  circleBorder: {
    borderWidth: sizes[1],
    borderRadius: sizes[10],
  },
  circle: {
    width: sizes[13],
    height: sizes[13],
    borderRadius: sizes[8],
  },
  mark: {
    fontSize: sizes[8],
    fontFamily: getFontFamily('500'),
    position: 'absolute',
  },
  viewCount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  price: {
    fontSize: sizes[15],
    fontFamily: getFontFamily('500'),
  },
  conSlider: {
    marginBottom: sizes[1],
    marginTop: sizes[16],
  },
  viewMarks: {
    flexDirection: 'row',
    marginBottom: sizes[15],
  },
  btnTop: {marginBottom: sizes[5], marginTop: sizes[15]},
  btnText: {fontSize: sizes[9]},
  textInfo: {
    fontSize: sizes[9],
    fontFamily: getFontFamily('500'),
    marginTop: sizes[15],
  },
  textDesc: {fontSize: sizes[9], marginTop: sizes[5]},
  textSwitch: {
    fontSize: sizes[10],
  },
  titleSwitch: {
    fontSize: sizes[10],
    fontFamily: getFontFamily('500'),
    flexGrow: 1,
  },
  viewSwitch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: sizes[12],
    marginBottom: sizes[15],
  },
});
export default WeightUnit;
