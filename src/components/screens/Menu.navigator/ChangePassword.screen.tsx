import React, {useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {ChangePasswordScreenProps} from '../../navigators/Menu.navigator';
import {Controller, useForm} from 'react-hook-form';
import {actionsUser} from '../../../redux/user/userReducer';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import {useDispatch} from 'react-redux';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import MyTextInput from '../../controls/MyTextInput';
import t from '../../../utils/translate';
import getErrorByObj from '../../../utils/getErrorByObj';
import validation from '../../../utils/validation';
import BlockCheckPassword from '../../common/BlockCheckPassword';
import {ScrollView} from 'react-native-gesture-handler';
import {sizes, useTheme} from '../../../context/ThemeContext';
import MyButton from '../../controls/MyButton';
import {useAxios} from '../../../useHooks/useAxios';
import service from '../../../services/service';
import MyText from '../../controls/MyText';

const ChangePasswordScreen = React.memo((props: ChangePasswordScreenProps) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const {errorColor} = useTheme();
  const {control, handleSubmit, errors, watch, clearErrors} = useForm({
    reValidateMode: 'onChange',
    mode: 'onChange',
  });
  const {isLoading, request, error} = useAxios(service.changePassword);

  useEffect(() => {
    return () => {
      dispatch(actionsUser.setError(null));
    };
  }, []);

  const onSubmit = async (data) => {
    const res = await request(data);
    if (res.success) {
      props.navigation.replace('SecondaryNavigator', {
        screen: 'Result',
        params: {
          title: t('successPassword'),
          navigator: 'MenuNavigator',
          screen: 'Settings',
        },
      });
    }
  };

  useDidUpdateEffect(() => {
    if (watch('newPassword') === watch('confirmNewPassword')) {
      clearErrors('confirmNewPassword');
    }
  }, [watch('newPassword')]);

  return (
    <SafeAreaView style={[styles.container, {marginTop: -insets.top}]}>
      <ScrollView bounces={false} style={{flex: 1, paddingTop: sizes[5]}}>
        <Controller
          control={control}
          render={({onChange, onBlur, value}) => (
            <MyTextInput
              label={t('tIPasswordOldLabel')}
              placeholder={t('tIPasswordOldPlaceholder')}
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
        <Controller
          control={control}
          render={({onChange, onBlur, value}) => (
            <MyTextInput
              label={t('tIPasswordNewLabel')}
              placeholder={t('tIPasswordNewPlaceholder')}
              keyboardType={'visible-password'}
              textContentType={'password'}
              styleCon={styles.inputText}
              value={value}
              onChangeText={onChange}
              error={getErrorByObj(errors, 'newPassword')}
            />
          )}
          name="newPassword"
          rules={validation.password}
        />
        <BlockCheckPassword password={watch('newPassword')} />
        <Controller
          control={control}
          render={({onChange, onBlur, value}) => (
            <MyTextInput
              label={t('tIPasswordRepeatLabel')}
              placeholder={t('tIPasswordRepeatPlaceholder')}
              keyboardType={'visible-password'}
              textContentType={'password'}
              styleCon={styles.inputText}
              value={value}
              onChangeText={onChange}
              error={getErrorByObj(errors, 'confirmNewPassword')}
            />
          )}
          name="confirmNewPassword"
          rules={validation.repeatPassword(watch('newPassword'))}
        />
      </ScrollView>
      <View style={styles.bottomBlock}>
        {error && (
          <MyText style={[styles.error, {color: errorColor}]}>
            {(error as any).error}
          </MyText>
        )}
        <MyButton
          styleText={styles.btnText}
          disabled={isLoading}
          onPress={handleSubmit(onSubmit)}>
          змінити пароль
        </MyButton>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    marginHorizontal: sizes[5],
    marginTop: sizes[8],
    flex: 1,
  },
  inputText: {
    paddingBottom: sizes[8],
  },
  btnText: {
    fontSize: sizes[9],
  },
  bottomBlock: {
    marginBottom: sizes[5],
    alignItems: 'center',
  },
  error: {
    fontSize: sizes[9],
    paddingVertical: sizes[5],
  },
});

export default ChangePasswordScreen;
