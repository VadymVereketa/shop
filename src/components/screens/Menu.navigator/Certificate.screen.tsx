import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {CertificateScreenProps} from '../../navigators/Menu.navigator';

const CertificateScreen = (props: CertificateScreenProps) => {
  return (
    <View style={[styles.container]}>
      <Text>CertificateScreen</Text>
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

export default CertificateScreen;
