import React, {useEffect, useState} from 'react';
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
import MyButton, {GhostButton} from '../../controls/MyButton';
import {getFontFamily} from '../../../utils/getFontFamily';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAxios} from '../../../useHooks/useAxios';
import service from '../../../services/service';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {strTime} from '../../../utils/getOptionsDate';
import t from '../../../utils/translate';

const CELL_COUNT = 5;

const VerificationScreen = ({navigation, route}: VerificationScreenProps) => {
  const {phone} = route.params;
  const insets = useSafeAreaInsets();
  const {errorColor, background, primary, border} = useTheme();
  const [time, setTime] = useState(90);
  const {isLoading, request, error} = useAxios(service.restorePassword);
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    runTime();
  }, []);

  const runTime = () => {
    if (time < 1) {
      setTime(90);
      return;
    }

    setTimeout(() => {
      setTime((t) => {
        return t - 1;
      });
      runTime();
    }, 1000);
  };

  const handleAgainSendCode = async () => {
    const res = await service.resetPassword(phone);
    if (res.success) {
      runTime();
    }
  };
  const onSubmit = async () => {
    const res = await request({
      phone,
      code: value,
    });
    if (res.success) {
      navigation.replace('SecondaryNavigator', {
        screen: 'Result',
        params: {
          title: t('authCodeSend'),
          navigator: 'AuthNavigator',
          screen: 'Login',
        },
      });
    } else if (res.code === 423) {
      setTime(0);
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
            <MyText style={styles.text}>{t('authVerification')}</MyText>
            <MyText>
              {t('authConfirmCode')}
              {phone}
            </MyText>
          </View>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            selectionColor={primary}
            renderCell={({index, symbol, isFocused}) => (
              <MyText
                key={index}
                style={[
                  styles.cell,
                  {borderColor: isFocused ? primary : border},
                ]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </MyText>
            )}
          />
          {time <= 0 ? (
            <MyText style={{color: primary}} onPress={handleAgainSendCode}>
              {t('authSendAgain')}
            </MyText>
          ) : (
            <MyText style={{color: primary}}>
              {t('authRepeatSend')} {strTime(time)}
            </MyText>
          )}
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
            disabled={value.length !== 5}
            isLoading={isLoading}
            styleText={{fontSize: sizes[9]}}
            onPress={onSubmit}>
            {t('btnContinue')}
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
  codeFieldRoot: {
    marginBottom: sizes[10],
  },
  cell: {
    width: sizes[30],
    paddingVertical: sizes[8],
    height: sizes[30],
    borderRadius: StyleSheet.hairlineWidth,
    fontSize: sizes[10],
    borderWidth: 1,
    textAlign: 'center',
  },
});

export default VerificationScreen;
