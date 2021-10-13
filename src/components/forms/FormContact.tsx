import React from 'react';
import {IContact} from '../../typings/FetchData';
import {StyleSheet, View} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import {Controller, useForm} from 'react-hook-form';
import MyTextInput, {MyTextPhoneInput} from '../controls/MyTextInput';
import t from '../../utils/translate';
import getErrorByObj from '../../utils/getErrorByObj';
import {ScrollView} from 'react-native-gesture-handler';
import MyButton from '../controls/MyButton';
import {useAxios} from '../../useHooks/useAxios';
import service from '../../services/service';
import {useDispatch} from 'react-redux';
import {actionsUser} from '../../redux/user/userReducer';
import BlockButtons from '../common/BlockButtons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  formatPhone,
  getIsCustomPhone,
  getWithoutCodePhone,
} from '../../utils/normalizePhone';
import useValidation from '../../utils/validation';

interface IFormContactProps {
  onCancel: any;
  onOk: any;
  defaultValues?: IContact;
}

interface IData {
  name: string;
  phone: string;
}

const getDefault = (data?: IContact) => {
  if (data) {
    return {
      name: `${data.firstName} ${data.lastName}`,
      phone: data.phone,
    };
  }
  return undefined;
};

const FormContact = ({defaultValues, onCancel, onOk}: IFormContactProps) => {
  const validation = useValidation();
  const dispatch = useDispatch();
  const {errorColor} = useTheme();
  const {request, isLoading} = useAxios(
    defaultValues ? service.updateContact : service.addContact,
  );

  const {control, handleSubmit, errors} = useForm({
    reValidateMode: 'onBlur',
    mode: 'onBlur',
    defaultValues: getDefault(defaultValues),
  });

  const handleOk = async (data: IData) => {
    const [firstName, ...lastName] = data.name.split(' ');
    const fetchData: IContact = {
      id: defaultValues ? defaultValues.id : (undefined as any),
      firstName,
      lastName: lastName ? lastName.join(' ') : '',
      isPhoneCustom: getIsCustomPhone(data.phone),
      phone: getWithoutCodePhone(data.phone),
    };

    const res = await request<IContact>(fetchData);
    if (res.success) {
      defaultValues
        ? dispatch(actionsUser.updateContact(res.data))
        : dispatch(actionsUser.addContact(res.data));
      onOk(res.data);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <MyTextInput
            autoFocus
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
          <MyTextPhoneInput
            label={t('tIPhoneLabel')}
            placeholder={t('tIPhonePlaceholder')}
            keyboardType={'phone-pad'}
            textContentType={'telephoneNumber'}
            styleCon={styles.inputText}
            onChangeText={onChange}
            defaultValue={value}
            error={getErrorByObj(errors, 'phone')}
          />
        )}
        name="phone"
        rules={validation.required}
      />
      <BlockButtons
        isLoading={isLoading}
        onOk={handleSubmit(handleOk)}
        onCancel={handleCancel}
        textCancel={t('btnCancel')}
        textOk={t('btnSave')}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  inputText: {
    paddingBottom: sizes[8],
  },
});

export default FormContact;
