import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {SignUpScreenProps} from '../../navigators/Auth.navigator';
import {sizes, useTheme} from '../../../context/ThemeContext';
import Logo from '../../common/Logo';
import MyText from '../../common/MyText';
import MyTextInput from '../../common/MyTextInput';
import MyButton, {GhostButton} from '../../common/MyButton';
import {getFontFamily} from '../../../utils/getFontFamily';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import DesignIcon from '../../common/DesignIcon';
import {ScrollView} from 'react-native-gesture-handler';

interface IBlockCheckPasswordProps {
  password: string;
}
interface IItemCheckPasswordProps {
  password: string;
  check: (str: string) => boolean;
  text: string;
}
const ItemCheckPassword = ({
  check,
  password,
  text,
}: IItemCheckPasswordProps) => {
  const {text: color, lightText, primary, background} = useTheme();
  const isCheck = check(text);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: sizes[4],
      }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: sizes[8],
          height: sizes[8],
          borderRadius: sizes[4],
          borderWidth: 0.5,
          borderColor: isCheck ? primary : lightText,
          marginRight: sizes[8],
          backgroundColor: isCheck ? primary : background,
        }}>
        <DesignIcon name={'check-mark'} size={sizes[5]} fill={background} />
      </View>
      <MyText
        style={{
          color: isCheck ? color : lightText,
          fontFamily: getFontFamily(isCheck ? '500' : '300'),
        }}>
        {text}
      </MyText>
    </View>
  );
};

const checks = [
  {
    check: (str: string) => true,
    text: '8-м сімволів',
  },
  {
    check: (str: string) => false,
    text: '8-м сімволів',
  },
  {
    check: (str: string) => true,
    text: '8-м сімволів',
  },
];

const BlockCheckPassword = ({password}: IBlockCheckPasswordProps) => {
  return (
    <View>
      {checks.map((c) => (
        <ItemCheckPassword password={password} check={c.check} text={c.text} />
      ))}
    </View>
  );
};

const SignUpScreen = ({navigation}: SignUpScreenProps) => {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      keyboardVerticalOffset={-responsiveHeight(7)}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View
        style={[
          styles.container,
          {
            paddingLeft: insets.left || sizes[5],
            paddingRight: insets.right || sizes[5],
            paddingBottom: insets.bottom,
          },
        ]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1, zIndex: 1000}}>
          <Logo height={sizes[16]} width={sizes[50]} resizeMode={'contain'} />
          <View style={styles.viewText}>
            <MyText style={styles.text}>Вітаємо Вас в Egersund!</MyText>
          </View>
          <MyTextInput
            label={"Ім'я"}
            placeholder={"Введіть ім'я"}
            keyboardType={'default'}
            textContentType={'name'}
            styleCon={styles.inputText}
          />
          <MyTextInput
            label={'Мобільний телефон'}
            keyboardType={'phone-pad'}
            textContentType={'telephoneNumber'}
            styleCon={styles.inputText}
          />
          <MyTextInput
            label={'Введіть пароль'}
            placeholder="Введіть пароль"
            keyboardType={'visible-password'}
            textContentType={'password'}
            styleCon={styles.passwordText}
          />
          <BlockCheckPassword password={''} />
          <MyTextInput
            placeholder="Введіть пароль"
            label={'Повторіть пароль'}
            keyboardType={'visible-password'}
            textContentType={'newPassword'}
            styleCon={styles.repeatPasswordText}
          />
        </ScrollView>
        <View
          style={{
            flexDirection: 'column',
          }}>
          <MyButton>Зареєструватися</MyButton>
          <GhostButton
            onPress={() => navigation.replace('Login', {})}
            ultraWidth={false}
            styleText={{fontFamily: getFontFamily('500')}}
            containerStyle={{
              flexGrow: 0,
            }}>
            У мене є аккаунт! Увійти
          </GhostButton>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: sizes[15],
    justifyContent: 'space-between',
    flex: 1,
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
  passwordText: {
    marginBottom: sizes[5],
  },
  repeatPasswordText: {
    marginBottom: sizes[10],
    marginTop: sizes[6],
  },
});

export default SignUpScreen;
