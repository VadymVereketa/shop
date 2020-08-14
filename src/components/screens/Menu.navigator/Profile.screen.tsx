import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {ProfileScreenProps} from '../../navigators/Menu.navigator';

const ProfileScreen = (props: ProfileScreenProps) => {
  return (
    <View style={[styles.container]}>
      <Text>ProfileScreen</Text>
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

export default ProfileScreen;
