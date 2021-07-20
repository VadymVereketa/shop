import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {EditProfileScreenProps} from '../../navigators/Menu.navigator';
import {sizes} from '../../../context/ThemeContext';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import MyButton from '../../controls/MyButton';
import {Controller, useForm} from 'react-hook-form';
import {useAxios} from '../../../useHooks/useAxios';
import service from '../../../services/service';
import MyTextInput, {MyTextPhoneInput} from '../../controls/MyTextInput';
import t from '../../../utils/translate';
import getErrorByObj from '../../../utils/getErrorByObj';
import validation from '../../../utils/validation';
import {IUser} from '../../../typings/FetchData';
import {useDispatch, useSelector} from 'react-redux';
import {refreshUser, selectorsUser} from '../../../redux/user/userReducer';
import {ScrollView} from 'react-native-gesture-handler';
import BlockButtons from '../../common/BlockButtons';

const getSettingForInput = (name: 'phone' | 'email' | 'name') => {
  switch (name) {
    case 'phone':
      return {
        label: t('tIPhoneLabel'),
        placeholder: t('tIPhonePlaceholder'),
        keyboardType: 'phone-pad',
        textContentType: 'telephoneNumber',
        name: 'phone',
        rules: validation.required,
      };
    case 'email':
      return {
        label: t('tIEmailLabel'),
        placeholder: t('tIEmailPlaceholder'),
        keyboardType: 'email-address',
        textContentType: 'emailAddress',
        name: 'email',
        rules: validation.required,
      };
    case 'name':
      return {
        label: t('tINameLabel'),
        placeholder: t('tINamePlaceholder'),
        keyboardType: 'default',
        textContentType: 'name',
        name: 'name',
        rules: validation.required,
      };
  }
};

const getDefaultValue = (user: IUser, field: 'phone' | 'email' | 'name') => {
  switch (field) {
    case 'phone':
      return {phone: user.phone};
    case 'email':
      return {email: user.email || ''};
    case 'name':
      return {name: `${user.firstName} ${user.lastName}`};
  }
};

const EditProfileScreen = React.memo(
  ({navigation, route}: EditProfileScreenProps) => {
    const dispatch = useDispatch();
    const {field} = route.params;
    const user = useSelector(selectorsUser.getUser)!;
    const insets = useSafeAreaInsets();
    const {request, isLoading} = useAxios(service.updateProfile);

    const handleCancel = () => {
      navigation.goBack();
    };

    const handleOk = async (data: any) => {
      if (field === 'name') {
        const [firstName, ...lastName] = data.name.trim().split(' ');
        data = {
          firstName,
          lastName: lastName ? lastName.join(' ') : '',
        };
      } else {
        data[field] = data[field].trim();
      }
      const res = await request(data);
      if (res.success) {
        await dispatch(refreshUser);
        handleCancel();
      }
    };

    const {control, handleSubmit, errors} = useForm({
      reValidateMode: 'onChange',
      mode: 'onChange',
      defaultValues: getDefaultValue(user, field) as any,
    });

    const setting = getSettingForInput(field);

    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            marginTop: -insets.top,
          },
        ]}>
        {field === 'phone' ? (
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
                defaultValue={value}
              />
            )}
            name={setting.name}
            rules={setting.rules}
          />
        ) : (
          <Controller
            control={control}
            render={({onChange, onBlur, value}) => (
              <MyTextInput
                autoFocus
                label={setting.label}
                placeholder={setting.placeholder}
                keyboardType={setting.keyboardType as any}
                textContentType={setting.textContentType as any}
                styleCon={styles.inputText}
                value={value}
                onChangeText={onChange}
                error={getErrorByObj(errors, setting.name)}
              />
            )}
            name={setting.name}
            rules={setting.rules}
          />
        )}
        <BlockButtons
          isLoading={isLoading}
          onOk={handleSubmit(handleOk)}
          onCancel={handleCancel}
          textCancel={t('btnCancel')}
          textOk={t('btnSave')}
        />
      </SafeAreaView>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: sizes[5],
    marginBottom: sizes[5],
    paddingTop: sizes[5],
  },
  inputText: {
    paddingBottom: sizes[8],
  },
  btns: {
    flexDirection: 'row',
    marginTop: sizes[5],
    flexGrow: 1,
    marginHorizontal: -sizes[5],
  },
  btnText: {
    fontSize: sizes[9],
  },
  btn: {
    marginHorizontal: sizes[5],
    flex: 1,
  },
});

export default EditProfileScreen;
