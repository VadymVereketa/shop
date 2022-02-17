import React, {useEffect, useMemo, useState} from 'react';
import {View, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import {LoginScreenProps} from '../../navigators/Auth.navigator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Logo from '../../common/Logo';
import {sizes, useTheme} from '../../../context/ThemeContext';
import MyText from '../../controls/MyText';
import {getFontFamily} from '../../../utils/getFontFamily';
import {MyTextPhoneInput} from '../../controls/MyTextInput';
import {ScrollView} from 'react-native-gesture-handler';
import {Controller, useForm} from 'react-hook-form';
import getErrorByObj from '../../../utils/getErrorByObj';
import {useDispatch, useSelector} from 'react-redux';
import {
  actionsUser,
  fetchLogin,
  selectorsUser,
} from '../../../redux/user/userReducer';
import t from '../../../utils/translate';
import {getWithoutCodePhone} from '../../../utils/normalizePhone';
import BackgroundBlock from '../../common/BackgroundBlock';
import ShadowWrapper from '../../common/ShadowWrapper';
import DesignIcon, {IName} from '../../common/DesignIcon';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import GoogleCaptcha from '../../common/GoogleCaptcha';
import {useAxios} from '../../../useHooks/useAxios';
import service from '../../../services/service';
import useValidation from '../../../utils/validation';

const LoginScreen = React.memo(({navigation}: LoginScreenProps) => {
  const validation = useValidation();
  const insets = useSafeAreaInsets();
  const {background, primary} = useTheme();
  const [isReadySendCode, setIsReadySendCode] = useState(false);
  const {isLoading, request} = useAxios(service.sendLoginCode);
  const dispatch = useDispatch();
  const options = useMemo(() => {
    return [
      {
        icon: 'MarkerIcon',
        title: t('markerIcon'),
      },
      {
        icon: 'HistoryOrderIcon',
        title: t('historyOrderIcon'),
      },
      {
        icon: 'PaymentIcon',
        title: t('paymentIcon'),
      },
    ] as {icon: IName; title: string}[];
  }, []);

  const {control, handleSubmit, watch, errors} = useForm({
    reValidateMode: 'onChange',
    mode: 'onChange',
  });
  const onSubmit = async (data) => {
    await dispatch(fetchLogin(getWithoutCodePhone(data.phone), data.password));
  };

  useEffect(() => {
    return () => {
      dispatch(actionsUser.setError(null));
    };
  }, []);

  useDidUpdateEffect(() => {
    const phone = getWithoutCodePhone(watch('phone') || '');
    const length = phone.length;
    console.log(length);

    setIsReadySendCode(length === 12);
  }, [watch('phone')]);

  const sendLoginCode = async (token: string) => {
    const phone = getWithoutCodePhone(watch('phone') || '');

    const res = await request({
      phone,
      token,
    });

    if (res.success) {
      navigation.navigate('Verification', {
        phone,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {isReadySendCode && <GoogleCaptcha onConfirm={sendLoginCode} />}
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
            <MyText style={styles.text}>{t('enterToLocalAccount1')}</MyText>
            <MyText style={styles.text}>{t('enterToLocalAccount2')}</MyText>
          </View>
          <BackgroundBlock
            style={{
              marginBottom: responsiveScreenHeight(5),
            }}>
            <ShadowWrapper
              style={{
                shadowColor: 'rgb(160, 160, 160);',
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.2,
                shadowRadius: 6,
              }}>
              <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                  <MyTextPhoneInput
                    editable={!isLoading}
                    label={t('tIPhoneLabel')}
                    placeholder={t('tIPhonePlaceholder')}
                    keyboardType={'phone-pad'}
                    textContentType={'telephoneNumber'}
                    styleCon={styles.inputText}
                    styleLabel={{
                      marginBottom: sizes[6],
                    }}
                    styleInner={{
                      borderRadius: sizes[2],
                    }}
                    onChangeText={onChange}
                    error={getErrorByObj(errors, 'phone')}
                  />
                )}
                name="phone"
                rules={validation.required}
              />
            </ShadowWrapper>
          </BackgroundBlock>
          {options.map((item) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: sizes[10],
                  marginBottom: responsiveScreenHeight(4),
                }}>
                <View
                  style={{
                    backgroundColor: primary,
                    width: sizes[26],
                    height: sizes[26],
                    borderRadius: sizes[13],
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <DesignIcon
                    name={item.icon}
                    size={sizes[10]}
                    fill={background}
                  />
                </View>
                <MyText style={{marginLeft: sizes[10]}}>{item.title}</MyText>
              </View>
            );
          })}
        </ScrollView>
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
  text: {
    fontSize: sizes[12],
    fontFamily: getFontFamily('500'),
  },
  viewText: {
    marginVertical: responsiveScreenHeight(4),
  },
  inputText: {
    paddingBottom: sizes[8],
  },
});

export default LoginScreen;
