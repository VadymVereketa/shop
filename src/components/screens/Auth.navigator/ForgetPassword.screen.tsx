import React from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {ScrollView} from 'react-native-gesture-handler';
import Logo from '../../common/Logo';
import MyText from '../../controls/MyText';
import t from '../../../utils/translate';
import {Controller, useForm} from 'react-hook-form';
import MyTextInput, {MyTextPhoneInput} from '../../controls/MyTextInput';
import getErrorByObj from '../../../utils/getErrorByObj';
import validation from '../../../utils/validation';
import MyButton, {GhostButton} from '../../controls/MyButton';
import {getFontFamily} from '../../../utils/getFontFamily';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ForgetPasswordScreenProps} from '../../navigators/Auth.navigator';
import {useAxios} from '../../../useHooks/useAxios';
import service from '../../../services/service';

const ForgetPasswordScreen = ({
  navigation,
  route,
}: ForgetPasswordScreenProps) => {
  const insets = useSafeAreaInsets();
  const {control, handleSubmit, errors} = useForm({
    reValidateMode: 'onChange',
    mode: 'onChange',
  });
  const {errorColor} = useTheme();
  const {isLoading, request, error} = useAxios(service.resetPassword);

  const onSubmit = async (data) => {
    const res = await request(data.phone);
    if (res.success) {
      navigation.navigate('Verification', {
        phone: data.phone,
      });
    }
  };

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
            <MyText style={styles.text}>{t('authForgetPassword')}</MyText>
          </View>
          <Controller
            control={control}
            render={({onChange, onBlur, value}) => (
              <MyTextPhoneInput
                label={t('tIPhoneLabel')}
                placeholder={t('tIPhonePlaceholder')}
                keyboardType={'phone-pad'}
                textContentType={'telephoneNumber'}
                styleCon={styles.inputText}
                onChangeText={onChange}
                error={getErrorByObj(errors, 'phone')}
              />
            )}
            name="phone"
            rules={validation.required}
          />
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
              {error.error}
            </MyText>
          )}
          <MyButton
            isLoading={isLoading}
            styleText={{fontSize: sizes[9]}}
            onPress={handleSubmit(onSubmit)}>
            {t('authGetCode')}
          </MyButton>
          <GhostButton
            onPress={() => navigation.navigate('Login', {})}
            ultraWidth={false}
            styleText={{fontFamily: getFontFamily('500')}}
            containerStyle={{
              flexGrow: 0,
            }}>
            {t('authRememberPassword')}
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

export default ForgetPasswordScreen;
