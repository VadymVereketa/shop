import React, {useState} from 'react';
import {View, StyleSheet, PixelRatio} from 'react-native';
import MyText from '../../common/MyText';
import IconButton from '../../common/IconButton';
import {sizes} from '../../../context/ThemeContext';
import MyTextInput from '../../common/MyTextInput';
import DesignIcon from '../../common/DesignIcon';

const MenuScreen = () => {
  const [text, setText] = useState('');

  return (
    <View style={[styles.container]}>
      <MyTextInput
        placeholder={'vadim'}
        isClear={true}
        value={text}
        onChangeText={(t) => setText(t)}
        afterIcon={{
          onPress: () => null,
          name: 'search',
        }}
      />
      <MyTextInput
        label={'password'}
        textContentType={'password'}
        keyboardType={'visible-password'}
      />
      <MyTextInput
        placeholder={'vadim'}
        afterIcon={{
          onPress: () => null,
          name: 'search',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    margin: 40,
  },
});

export default MenuScreen;
