import React from 'react';
import {View, Switch, StyleSheet} from 'react-native';
import {useFormattingContext} from '../../context/FormattingContext';
import {sizes, useTheme} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import t from '../../utils/translate';
import MyText from '../controls/MyText';

const ChangeTheme = () => {
  const {border, primary, background, theme, onChangeTheme} = useTheme();

  const handelChangeTheme = () => {
    onChangeTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <View>
      <View style={[styles.text, {borderBottomColor: border}]}>
        <MyText style={{paddingLeft: sizes[6]}}>{t('commonTheme')}</MyText>
      </View>
      <View style={styles.view}>
        <MyText style={{fontFamily: getFontFamily('400'), fontSize: sizes[9]}}>
          {t('commonLight')}
        </MyText>
        <Switch
          trackColor={{false: primary, true: primary}}
          thumbColor={background}
          ios_backgroundColor={primary}
          onValueChange={handelChangeTheme}
          value={theme === 'light'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    paddingTop: sizes[10],
    paddingBottom: sizes[4],
    borderBottomWidth: 1,
  },
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: sizes[6],
    paddingVertical: sizes[10],
    paddingRight: 0,
  },
});

export default ChangeTheme;
