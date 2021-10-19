import {useState} from 'hoist-non-react-statics/node_modules/@types/react';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';
import {sizes} from '../../../context/ThemeContext';
import {actionsUser} from '../../../redux/user/userReducer';
import service from '../../../services/service';
import {useAxios} from '../../../useHooks/useAxios';
import getErrorByObj from '../../../utils/getErrorByObj';
import {getFontFamily} from '../../../utils/getFontFamily';
import t from '../../../utils/translate';
import useValidation from '../../../utils/validation';
import Logo from '../../common/Logo';
import MyButton from '../../controls/MyButton';
import MyText from '../../controls/MyText';
import MyTextInput from '../../controls/MyTextInput';
import {EditNameScreenProps} from '../../navigators/Secondary.navigator';

const EditNameScreen = ({navigation}: EditNameScreenProps) => {
  const validation = useValidation();
  const dispatch = useDispatch();
  const {request, isLoading} = useAxios(service.updateProfile);
  const {control, handleSubmit, errors} = useForm({
    reValidateMode: 'onChange',
    mode: 'onChange',
  });

  const onSubmit = async ({name}: any) => {
    const [firstName = '', lastName = ''] = name.trim().split(' ');
    const data = {
      firstName,
      lastName,
    };
    const res = await request(data);
    if (res.success) {
      dispatch(actionsUser.updateUser(res.data));
      navigation.navigate('MainNavigator', {
        screen: 'Restaurant',
      });
    }
  };

  return (
    <SafeAreaView style={styles.con}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{
          flex: 1,
          paddingTop: sizes[20],
        }}>
        <View
          style={{
            flexGrow: 1,
          }}>
          <Logo height={sizes[16]} width={sizes[50]} resizeMode={'contain'} />
          <MyText style={styles.text}>{t('signUpWelcome')}</MyText>
          <Controller
            control={control}
            render={({onChange, onBlur, value}) => (
              <MyTextInput
                label={t('tINameLabel')}
                placeholder={t('tINamePlaceholder')}
                keyboardType={'default'}
                textContentType={'name'}
                value={value}
                onChangeText={onChange}
                error={getErrorByObj(errors, 'name')}
              />
            )}
            name="name"
            rules={validation.required}
          />
        </View>
        <MyButton
          ultraWidth
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}>
          {t('btnContinue')}
        </MyButton>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  con: {
    marginHorizontal: sizes[5],
    marginTop: sizes[20],
    flexGrow: 1,
  },
  text: {
    fontSize: sizes[12],
    fontFamily: getFontFamily('500'),
    marginVertical: sizes[20],
  },
});
export default EditNameScreen;
