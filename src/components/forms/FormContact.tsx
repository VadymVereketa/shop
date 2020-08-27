import React from 'react';
import {IContact} from '../../typings/FetchData';
import {StyleSheet, View} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import {Controller, useForm} from 'react-hook-form';
import MyTextInput from '../controls/MyTextInput';
import t from '../../utils/translate';
import getErrorByObj from '../../utils/getErrorByObj';
import validation from '../../utils/validation';
import {ScrollView} from 'react-native-gesture-handler';
import MyButton from '../controls/MyButton';
import {useAxios} from '../../useHooks/useAxios';
import service from '../../services/service';
import {useDispatch} from 'react-redux';
import {actionsUser} from '../../redux/user/userReducer';

interface IFormContactProps {
  onCancel: any;
  onOk: any;
  defaultValues?: IContact;
}

interface IData {
  name: string;
  phone: string;
}

const FormContact = ({defaultValues, onCancel, onOk}: IFormContactProps) => {
  const dispatch = useDispatch();
  const {errorColor} = useTheme();
  const {request, isLoading} = useAxios(
    defaultValues ? service.updateContact : service.addContact,
  );
  const {control, handleSubmit, errors} = useForm({
    reValidateMode: 'onChange',
    mode: 'onChange',
  });

  const handleOk = async (data: IData) => {
    const [firstName, lastName] = data.name;
    const fetchData: IContact = {
      id: defaultValues ? defaultValues.id : (undefined as any),
      firstName,
      lastName,
      isPhoneCustom: false,
      phone: data.phone,
    };
    const res = await request<IContact>(fetchData);
    if (res.success) {
      defaultValues
        ? dispatch(actionsUser.updateContact(res.data))
        : dispatch(actionsUser.addContact(res.data));
      onOk();
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
      <View style={styles.btns}>
        <MyButton
          onPress={handleCancel}
          disabled={isLoading}
          type={'default'}
          containerStyle={styles.btn}
          isActive
          styleText={styles.btnText}>
          скасувати
        </MyButton>
        <MyButton
          onPress={handleSubmit(handleOk)}
          disabled={isLoading}
          containerStyle={styles.btn}
          styleText={styles.btnText}>
          зберегти
        </MyButton>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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

export default FormContact;
