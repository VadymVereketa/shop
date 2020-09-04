import React, {useState} from 'react';
import {VerificationScreenProps} from '../../navigators/Auth.navigator';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {ScrollView} from 'react-native-gesture-handler';
import Logo from '../../common/Logo';
import MyText from '../../controls/MyText';
import {Controller, useForm} from 'react-hook-form';
import MyTextInput from '../../controls/MyTextInput';
import t from '../../../utils/translate';
import getErrorByObj from '../../../utils/getErrorByObj';
import validation from '../../../utils/validation';
import MyButton, {GhostButton} from '../../controls/MyButton';
import {getFontFamily} from '../../../utils/getFontFamily';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAxios} from '../../../useHooks/useAxios';
import service from '../../../services/service';

const VerificationScreen = ({navigation, route}: VerificationScreenProps) => {
  const {phone} = route.params;
  const insets = useSafeAreaInsets();
  const {control, handleSubmit, errors} = useForm({
    reValidateMode: 'onChange',
    mode: 'onChange',
  });
  const [index, setIndex] = useState(0);
  const {errorColor, background} = useTheme();
  const {isLoading, request, error} = useAxios(service.restorePassword);

  const onSubmit = async (data) => {
    console.log(data);
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
            <MyText style={styles.text}>Верификация</MyText>
            <MyText>
              Введіть 5 цифры которые пришли на номер
              {phone}
            </MyText>
          </View>
          <View style={styles.viewCode}>
            {[0, 1, 2, 3, 4].map((i) => {
              return (
                <Controller
                  key={i}
                  control={control}
                  render={({onChange, onBlur, value}) => (
                    <MyTextInput
                      onChange={(e) => {
                        console.log(e.target);
                        if (e.nativeEvent.text.length > 0) {
                          Keyboard.dismiss();
                        }
                      }}
                      onBlur={() => {
                        setIndex((i) => {
                          return i < 4 ? i + 1 : i;
                        });
                      }}
                      autoFocus={index === i}
                      focusable={index === i}
                      maxLength={1}
                      keyboardType={'numeric'}
                      textContentType={'none'}
                      styleCon={styles.inputCon}
                      style={styles.input}
                      value={value}
                      onChangeText={onChange}
                      error={getErrorByObj(errors, `code[${i}]`)}
                    />
                  )}
                  name={`code[${i}]`}
                  rules={validation.required}
                />
              );
            })}
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
              {error.error}
            </MyText>
          )}
          <MyButton
            isLoading={isLoading}
            styleText={{fontSize: sizes[9]}}
            onPress={handleSubmit(onSubmit)}>
            Продовжити
          </MyButton>
          <GhostButton
            ultraWidth={false}
            styleText={{color: background}}
            containerStyle={{
              flexGrow: 0,
            }}>
            Я
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
    marginBottom: sizes[8],
  },
  viewText: {
    marginVertical: sizes[15],
  },
  viewCode: {
    marginHorizontal: -sizes[3],
    flexDirection: 'row',
  },
  inputCon: {
    marginHorizontal: sizes[3],
    flexGrow: 1,
  },
  input: {
    textAlign: 'center',
    height: sizes[30],
  },
});

export default VerificationScreen;
