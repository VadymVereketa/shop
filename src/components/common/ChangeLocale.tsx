import {useNavigation} from '@react-navigation/core';
import React, {useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {Locale, useFormattingContext} from '../../context/FormattingContext';
import {sizes, useTheme} from '../../context/ThemeContext';
import {
  serviceGetCustomCategories,
  thunkGetTags,
} from '../../redux/category/categoryReducer';
import {thunkGetSellPoints} from '../../redux/sellPoints/sellPointsReducer';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import {getFontFamily} from '../../utils/getFontFamily';
import portmone from '../../utils/portmone';
import t from '../../utils/translate';
import MyButton from '../controls/MyButton';
import MyText from '../controls/MyText';
import PressTitle from '../controls/PressTitle';

interface IChangeLocaleProps {
  navigation?: any;
}

const ChangeLocale = ({}: IChangeLocaleProps) => {
  const navigation = useNavigation<any>();
  const {border, primary, text, theme} = useTheme();
  const dispatch = useDispatch();
  const [isChangingLocale, setIsChangingLocale] = useState(false);
  const {currentLocale, setLocale} = useFormattingContext();

  useDidUpdateEffect(() => {
    changeLocale();
  }, [currentLocale]);

  const changeLocale = async () => {
    setIsChangingLocale(true);

    console.log('changeLocale');

    await dispatch(serviceGetCustomCategories);
    await dispatch(thunkGetSellPoints);
    await dispatch(thunkGetTags);

    if (Platform.OS === 'android') {
      portmone.invokePortmoneSdk({
        theme,
        lang: currentLocale,
        type: 'phone',
      });
    }

    setIsChangingLocale(false);
  };

  const options: {label: string; locale: Locale}[] = [
    {
      label: t('commonUA'),
      locale: 'uk',
    },
    {
      label: t('commonEN'),
      locale: 'en',
    },
    {
      label: t('commonRU'),
      locale: 'ru',
    },
  ];

  return (
    <View>
      <View style={[styles.text, {borderBottomColor: border}]}>
        <MyText style={{paddingLeft: sizes[6]}}>{t('commonLanguage')}</MyText>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: -sizes[2],
        }}>
        {options.map((opt) => {
          const isCurrent = currentLocale === opt.locale;
          return (
            <MyButton
              type={'default'}
              key={opt.locale}
              disabled={isChangingLocale}
              styleText={{
                textTransform: 'capitalize',
                color: isCurrent ? primary : text,
                fontFamily: isCurrent
                  ? getFontFamily('500')
                  : getFontFamily('300'),
              }}
              style={[
                styles.itemMenu,
                {
                  borderColor: isCurrent ? primary : border,
                },
              ]}
              onPress={() => setLocale(opt.locale)}>
              {opt.label}
            </MyButton>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: sizes[5],
  },
  itemMenu: {
    paddingVertical: sizes[5],
    marginHorizontal: sizes[2],
  },
  text: {
    paddingTop: sizes[10],
    paddingBottom: sizes[4],
    borderBottomWidth: 1,
    marginBottom: sizes[5],
  },
});

export default ChangeLocale;
