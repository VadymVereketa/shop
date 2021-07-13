import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SettingsScreenProps} from '../../navigators/Menu.navigator';
import PressTitle from '../../controls/PressTitle';
import {sizes, useTheme} from '../../../context/ThemeContext';
import MyText from '../../controls/MyText';
import {ScrollView, Switch} from 'react-native-gesture-handler';
import {getFontFamily} from '../../../utils/getFontFamily';
import t from '../../../utils/translate';
import ChangeLocale from '../../common/ChangeLocale';

const SettingsScreen = React.memo(({navigation}: SettingsScreenProps) => {
  const {border, primary, background, theme, onChangeTheme} = useTheme();

  const handelChangeTheme = () => {
    onChangeTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <View style={[styles.container]}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <PressTitle
          style={styles.itemMenu}
          isBorder
          onPress={() => navigation.push('ChangePassword', {})}>
          {t('btnChangePassword')}
        </PressTitle>
        {/* <PressTitle
          style={[styles.itemMenu, {backgroundColor: lightBackground}]}
          styleText={{color: lightText}}
          isBorder>
          {t('btnTextComment')}
        </PressTitle>*/}
        <ChangeLocale navigation={navigation} />

        <View style={[styles.text, {borderBottomColor: border}]}>
          <MyText style={{paddingLeft: sizes[6]}}>{t('commonTheme')}</MyText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: sizes[6],
            paddingRight: 0,
          }}>
          <MyText
            style={{fontFamily: getFontFamily('400'), fontSize: sizes[9]}}>
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
