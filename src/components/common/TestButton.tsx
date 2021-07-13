import React from 'react';
import {Button, Platform} from 'react-native';
//import {NativeModules} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import t from '../../utils/translate';
import MyText from '../controls/MyText';
//const {PortmoneCardModule} = NativeModules;

const TextButton = () => {
  const handlePress = async () => {
    /* if (Platform.OS === 'android') {
      PortmoneCardModule.invokePortmoneSdk('uk', 'phone');
    }*/
  };

  return (
    <TouchableOpacity
      containerStyle={{
        position: 'absolute',
        top: 100,
        right: 40,
        width: 100,
        height: 100,
        zIndex: 10000,
        backgroundColor: 'black',
      }}
      onPress={handlePress}>
      <MyText>{t('testText')}</MyText>
    </TouchableOpacity>
  );
};

export default TextButton;
