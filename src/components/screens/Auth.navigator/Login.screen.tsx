import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import {LoginScreenProps} from '../../navigators/Auth.navigator';
import PressTitle from '../../common/PressTitle';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Logo from '../../common/Logo';
import {sizes} from '../../../context/ThemeContext';
import MyText from '../../common/MyText';
import {getFontFamily} from '../../../utils/getFontFamily';
import MyTextInput from '../../common/MyTextInput';
import MyButton, {GhostButton} from '../../common/MyButton';
import {responsiveHeight} from 'react-native-responsive-dimensions';

const window = Dimensions.get('window');
const LoginScreen = ({navigation}: LoginScreenProps) => {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      keyboardVerticalOffset={-responsiveHeight(9)}
      behavior={Platform.OS === 'ios' ? 'position' : 'height'}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View
          style={[
            styles.container,
            {
              paddingLeft: insets.left || sizes[5],
              paddingRight: insets.right || sizes[5],
              paddingBottom: insets.bottom,
            },
          ]}>
          <View>
            <Logo height={sizes[16]} width={sizes[50]} resizeMode={'contain'} />
            <View style={styles.viewText}>
              <MyText style={styles.text}>Вітаємо в Egersund,</MyText>
              <MyText style={styles.text}>з поверненням!</MyText>
            </View>
            <MyTextInput
              label={'Мобільний телефон'}
              keyboardType={'phone-pad'}
              textContentType={'telephoneNumber'}
              styleCon={styles.inputText}
            />
            <MyTextInput
              label={'Пароль'}
              keyboardType={'visible-password'}
              textContentType={'password'}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <GhostButton
                ultraWidth={false}
                containerStyle={{
                  flexGrow: 0,
                }}
                isActive>
                Забув пароль?
              </GhostButton>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
            }}>
            <MyButton styleText={{fontSize: sizes[9]}}>Увійти</MyButton>
            <GhostButton
              onPress={() => navigation.replace('SignUp', {})}
              ultraWidth={false}
              styleText={{fontFamily: getFontFamily('500')}}
              containerStyle={{
                flexGrow: 0,
              }}>
              Немає аккаунту? Реєстрація
            </GhostButton>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: sizes[15],
    justifyContent: 'space-between',
    height: Platform.OS === 'android' ? undefined : responsiveHeight(90),
    flex: Platform.OS === 'android' ? 1 : 0,
  },
  text: {
    fontSize: sizes[12],
    fontFamily: getFontFamily('500'),
  },
  viewText: {
    marginVertical: sizes[15],
  },
  inputText: {
    marginBottom: sizes[10],
  },
});

export default LoginScreen;
