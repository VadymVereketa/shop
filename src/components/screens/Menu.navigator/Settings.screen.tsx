import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {SettingsScreenProps} from '../../navigators/Menu.navigator';

const SettingsScreen = (props: SettingsScreenProps) => {
  return (
    <View style={[styles.container]}>
      <Text>SettingsScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SettingsScreen;
