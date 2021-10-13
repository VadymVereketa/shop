import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import t from '../../utils/translate';
import ChangeLocale from '../common/ChangeLocale';
import ChangeTheme from '../common/ChangeTheme';
import LoginButton from '../common/LoginButton';
import PressTitle from '../controls/PressTitle';
import PhoneBlock from './PhoneBlock';

const NoAuthContent = () => {
  const {border} = useTheme();
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.contentContainerStyle}>
      <View>
        <PhoneBlock />
        <View
          style={[
            styles.viewBtn,
            {
              borderBottomColor: border,
              borderTopColor: border,
            },
          ]}>
          <LoginButton />
        </View>
        <PressTitle
          onPress={() =>
            navigation.navigate('SecondaryNavigator', {
              screen: 'Locations',
            })
          }
          style={[styles.itemMenu, {borderTopColor: border}]}
          isBorder>
          {t('storeLocations')}
        </PressTitle>
        {false && (
          <PressTitle
            onPress={() =>
              navigation.navigate('MenuNavigator', {
                screen: 'Profile',
              })
            }
            style={[styles.itemMenu]}
            isBorder>
            Залишити відгук про додаток //TODO:
          </PressTitle>
        )}
      </View>
      <View>
        <ChangeLocale />
        <ChangeTheme />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  itemMenu: {
    paddingVertical: sizes[9],
  },
  contentContainerStyle: {
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  viewBtn: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: sizes[4],
  },
});

export default NoAuthContent;
