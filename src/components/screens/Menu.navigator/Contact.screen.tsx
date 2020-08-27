import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {ContactScreenProps} from '../../navigators/Menu.navigator';
import {sizes} from '../../../context/ThemeContext';
import {getFontFamily} from '../../../utils/getFontFamily';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import FormContact from '../../forms/FormContact';

const ContactScreen = React.memo(({navigation, route}: ContactScreenProps) => {
  const insets = useSafeAreaInsets();
  const handleOk = () => {
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          marginTop: -insets.top,
        },
      ]}>
      <FormContact
        onCancel={handleCancel}
        onOk={handleOk}
        defaultValues={route.params.contact}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: sizes[5],
    paddingTop: sizes[5],
  },
});

export default ContactScreen;
