import React, {useEffect} from 'react';
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
import MyText from '../../controls/MyText';
import MyTextInput from '../../controls/MyTextInput';
import MyButton, {GhostButton} from '../../controls/MyButton';
import {getFontFamily} from '../../../utils/getFontFamily';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import DesignIcon from '../../common/DesignIcon';
import {ScrollView} from 'react-native-gesture-handler';
import {useForm, Controller} from 'react-hook-form';
import getErrorByObj from '../../../utils/getErrorByObj';
import validation from '../../../utils/validation';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import BlockCheckPassword from '../../common/BlockCheckPassword';
import {ISignUp} from '../../../typings/FetchData';
import {
  actionsUser,
  fetchLogin,
  fetchSignup,
  selectorsUser,
} from '../../../redux/user/userReducer';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/core';
import t from '../../../utils/translate';

interface IFormData {
  name: string;
  phone: string;
  password: string;
  confirmedPassword: string;
}

const SignUpScreen = React.memo(({navigation}: SignUpScreenProps) => {
  const error = useSelector(selectorsUser.getError);
  const isLoading = useSelector(selectorsUser.getLoading);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const {errorColor} = useTheme();
  const {control, handleSubmit, errors, watch, clearErrors} = useForm({
    reValidateMode: 'onChange',
    mode: 'onChange',
  });

  const onSubmit = async (data: IFormData) => {
    const [firstName, lastName] = data.name.split(' ');
    const fetchData: ISignUp = {
      isPhoneCustom: false,
      phone: data.phone,
      firstName,
      lastName: lastName || '',
      confirmedPassword: data.confirmedPassword,
      password: data.password,
    };
    const resSignUp: any = await dispatch(fetchSignup(fetchData));
    if (resSignUp.success) {
      await dispatch(fetchLogin(data.phone, data.password));
    }
  };

  useEffect(() => {
    return () => {
      dispatch(actionsUser.setError(null));
    };
  }, []);

  useDidUpdateEffect(() => {
    if (watch('password') === watch('confirmedPassword')) {
      clearErrors('confirmedPassword');
    }
  }, [watch('password')]);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      keyboardVerticalOffset={-responsiveHeight(3)}
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
        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
          <View style={styles.empty} />
          <Logo height={sizes[16]} width={sizes[50]} resizeMode={'contain'} />
          <View style={styles.viewText}>
            <MyText style={styles.text}>{t('signUpWelcome')}</MyText>
          </View>
          <Controller
            control={control}
            render={({onChange, onBlur, value}) => (
              <MyTextInput
                label={t('tINameLabel')}
                placeholder={t('tINamePlaceholder')}
                keyboardType={'default'}
                textContentType={'name'}
                styleCon={styles.inputText}
                value={value}
                onChangeText={onChange}
                error={getErrorByObj(errors, 'name')}
              />
            )}
            name="name"
            rules={validation.required}
          />
          <Controller
            control={control}
            render={({onChange, onBlur, value}) => (
              <MyTextInput
                label={t('tIPhoneLabel')}
                placeholder={t('tIPhonePlaceholder')}
                keyboardType={'phone-pad'}
                textContentType={'telephoneNumber'}
                styleCon={styles.inputText}
                value={value}
                onChangeText={onChange}
                error={getErrorByObj(errors, 'phone')}
              />
            )}
            name="phone"
            rules={validation.required}
          />
          <Controller
            control={control}
            render={({onChange, onBlur, value}) => (
              <MyTextInput
                label={t('tIPasswordLabel')}
                placeholder={t('tIPasswordPlaceholder')}
                keyboardType={'visible-password'}
                textContentType={'password'}
                styleCon={styles.inputText}
                value={value}
                onChangeText={onChange}
                error={getErrorByObj(errors, 'password')}
              />
            )}
            name="password"
            rules={validation.password}
          />
          <BlockCheckPassword password={watch('password')} />
          <Controller
            control={control}
            render={({onChange, onBlur, value}) => (
              <MyTextInput
                label={t('tIPasswordLabel')}
                placeholder={t('tIPasswordPlaceholder')}
                keyboardType={'visible-password'}
                textContentType={'password'}
                styleCon={styles.inputText}
                value={value}
                onChangeText={onChange}
                error={getErrorByObj(errors, 'confirmedPassword')}
              />
            )}
            name="confirmedPassword"
            rules={validation.repeatPassword(watch('password'))}
          />
        </ScrollView>
        <View style={styles.bottomBlock}>
          {error && (
            <MyText
              style={{
                color: errorColor,
                paddingVertical: sizes[5],
                fontSize: sizes[7],
              }}>
              {error}
            </MyText>
          )}
          <MyButton onPress={handleSubmit(onSubmit)} disabled={isLoading}>
            {t('signUpSubmit')}
          </MyButton>
          <GhostButton
            onPress={() => navigation.navigate('Login', {})}
            ultraWidth={false}
            styleText={{fontFamily: getFontFamily('500')}}
            containerStyle={{
              flexGrow: 0,
            }}>
            {t('signUpYesAccount')}
          </GhostButton>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  empty: {
    paddingTop: sizes[15],
  },
  container: {
    justifyContent: 'space-between',
    flex: 1,
  },
  bottomBlock: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: sizes[5],
  },
  text: {
    fontSize: sizes[12],
    fontFamily: getFontFamily('500'),
  },
  viewText: {
    marginVertical: sizes[15],
  },
  inputText: {
    paddingBottom: sizes[8],
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
