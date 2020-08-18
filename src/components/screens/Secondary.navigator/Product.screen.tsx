import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {ProductScreenProps} from '../../navigators/Secondary.navigator';
import CountInput from '../../common/CountInput';

const ProductScreen = ({navigation, route}: ProductScreenProps) => {
  return (
    <View style={[styles.container]}>
      <View style={[styles.con]}>
        <CountInput isWeightUnit={true} />
        <CountInput isWeightUnit={false} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  con: {
    flexDirection: 'row',
  },
});

export default ProductScreen;
