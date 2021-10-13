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
import portmone from '../../utils/portmone';
import t from '../../utils/translate';
import MyText from '../controls/MyText';
import PressTitle from '../controls/PressTitle';

interface IChangeLocaleProps {
  navigation?: any;
}

const ChangeLocale = ({navigation}: IChangeLocaleProps) => {
  const {border, primary, background, theme} = useTheme();
  const dispatch = useDispatch();
  const [isChangingLocale, setIsChangingLocale] = useState(false);
  const {currentLocale, setLocale} = useFormattingContext();

  useDidUpdateEffect(() => {
    changeLocale();
  }, [currentLocale]);

  const changeLocale = async () => {
    setIsChangingLocale(true);
    navigation &&
      navigation.setOptions({
        title: t('profileSettings'),
      });

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
      {options.map((opt) => {
        return (
          <PressTitle
            key={opt.locale}
            disabled={isChangingLocale}
            style={styles.itemMenu}
            onPress={() => setLocale(opt.locale)}
            isBorder
            afterIcon={{
              name: 'check-mark',
              size: sizes[10],
              fill: currentLocale === opt.locale ? primary : background,
            }}>
            {opt.label}
          </PressTitle>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: sizes[5],
  },
  itemMenu: {
    paddingVertical: sizes[9],
  },
  text: {
    paddingTop: sizes[30],
    paddingBottom: sizes[4],
    borderBottomWidth: 1,
  },
});

export default ChangeLocale;
