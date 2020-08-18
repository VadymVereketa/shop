import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {LoginScreenProps} from '../../navigators/Auth.navigator';
import {useFocusEffect} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Logo from '../../common/Logo';
import {sizes, useTheme} from '../../../context/ThemeContext';
import MyText from '../../common/MyText';
import {getFontFamily} from '../../../utils/getFontFamily';
import MyTextInput from '../../common/MyTextInput';
import MyButton, {GhostButton} from '../../common/MyButton';
import {ScrollView} from 'react-native-gesture-handler';
import {Controller, useForm} from 'react-hook-form';
import getErrorByObj from '../../../utils/getErrorByObj';
import validation from '../../../utils/validation';
import {useDispatch, useSelector} from 'react-redux';
import {
  actionsUser,
  fetchLogin,
  selectorsUser,
} from '../../../redux/user/userReducer';
import t from '../../../utils/translate';

const window = Dimensions.get('window');

const LoginScreen = ({navigation}: LoginScreenProps) => {
  const insets = useSafeAreaInsets();
  const {errorColor} = useTheme();
  const error = useSelector(selectorsUser.getError);
  const isLoading = useSelector(selectorsUser.getLoading);
  const dispatch = useDispatch();
  const {control, handleSubmit, errors} = useForm({
    reValidateMode: 'onChange',
    mode: 'onChange',
  });
  const onSubmit = (data) => {
    dispatch(fetchLogin(data.phone, data.password));
  };

  useEffect(() => {
    return () => {
      dispatch(actionsUser.setError(null));
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
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
          <View style={styles.empty} />
          <Logo height={sizes[16]} width={sizes[50]} resizeMode={'contain'} />
          <View style={styles.viewText}>
            <MyText style={styles.text}>{t('loginWelcome1')}</MyText>
            <MyText style={styles.text}>{t('loginWelcome2')}</MyText>
          </View>
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
            rules={validation.required}
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
              {t('loginForgetPassword')}
            </GhostButton>
          </View>
        </ScrollView>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
          }}>
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
          <MyButton
            disabled={isLoading}
            styleText={{fontSize: sizes[9]}}
            onPress={handleSubmit(onSubmit)}>
            {t('loginSubmit')}
          </MyButton>
          <GhostButton
            onPress={() => navigation.replace('SignUp', {})}
            ultraWidth={false}
            styleText={{fontFamily: getFontFamily('500')}}
            containerStyle={{
              flexGrow: 0,
            }}>
            {t('loginNoAccount')}
          </GhostButton>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  empty: {
    paddingTop: sizes[15],
  },
  container: {
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
    paddingBottom: sizes[8],
  },
});

export default LoginScreen;
