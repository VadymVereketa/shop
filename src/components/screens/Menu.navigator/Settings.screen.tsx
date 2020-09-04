import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {SettingsScreenProps} from '../../navigators/Menu.navigator';
import PressTitle from '../../controls/PressTitle';
import {sizes, useTheme} from '../../../context/ThemeContext';
import MyText from '../../controls/MyText';
import {useFormattingContext} from '../../../context/FormattingContext';
import {ScrollView} from 'react-native-gesture-handler';

const SettingsScreen = React.memo(({navigation}: SettingsScreenProps) => {
  const {
    border,
    primary,
    background,
    theme,
    onChangeTheme,
    lightBackground,
    lightText,
  } = useTheme();
  const {currentLocale, setLocale} = useFormattingContext();
  return (
    <View style={[styles.container]}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <PressTitle
          style={styles.itemMenu}
          isBorder
          onPress={() => navigation.push('ChangePassword', {})}>
          Змінити пароль
        </PressTitle>
        <PressTitle
          style={[styles.itemMenu, {backgroundColor: lightBackground}]}
          styleText={{color: lightText}}
          isBorder>
          Залишити відгук про додаток
        </PressTitle>
        <View style={[styles.text, {borderBottomColor: border}]}>
          <MyText style={{paddingLeft: sizes[6]}}>Мова додатка</MyText>
        </View>
        <PressTitle
          style={styles.itemMenu}
          onPress={() => setLocale('uk')}
          isBorder
          afterIcon={{
            name: 'check-mark',
            size: sizes[10],
            fill: currentLocale === 'uk' ? primary : background,
          }}>
          Українська
        </PressTitle>
        <PressTitle
          style={[styles.itemMenu, {backgroundColor: lightBackground}]}
          styleText={{color: lightText}}
          isBorder
          afterIcon={{
            name: 'check-mark',
            size: sizes[10],
            fill: currentLocale === 'en' ? primary : background,
          }}>
          Англійська
        </PressTitle>

        <View style={[styles.text, {borderBottomColor: border}]}>
          <MyText style={{paddingLeft: sizes[6]}}>Тема додатка</MyText>
        </View>
        <PressTitle
          style={styles.itemMenu}
          onPress={() => onChangeTheme('light')}
          isBorder
          afterIcon={{
            name: 'check-mark',
            size: sizes[10],
            fill: theme === 'light' ? primary : background,
          }}>
          Свiтла
        </PressTitle>
        <PressTitle
          onPress={() => onChangeTheme('dark')}
          style={styles.itemMenu}
          isBorder
          afterIcon={{
            name: 'check-mark',
            size: sizes[10],
            fill: theme === 'dark' ? primary : background,
          }}>
          Темна
        </PressTitle>
      </ScrollView>
    </View>
  );
});

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

export default SettingsScreen;
