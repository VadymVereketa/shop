import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {ProductScreenProps} from '../../navigators/Secondary.navigator';
import CountInput from '../../common/CountInput';

const ProductScreen = ({navigation, route}: ProductScreenProps) => {
  const [v1, setV1] = useState(1000);
  const [v2, setV2] = useState(1000);
  return (
    <View style={[styles.container]}>
      <View style={[styles.con]}>
        <CountInput
          isWeightUnit={true}
          value={v1}
          onChange={setV1}
          isEditable={true}
        />
        <CountInput
          isWeightUnit={false}
          value={v2}
          onChange={setV2}
          isEditable={true}
        />
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
