import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const ThirdStepScreen = React.memo((props: any) => {
  return (
    <View style={[styles.container]}>
      <Text>ThirdStepScreen</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ThirdStepScreen;
