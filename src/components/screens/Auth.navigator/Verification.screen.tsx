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
import {formatPhone} from '../../../utils/normalizePhone';
import BackgroundBlock from '../../common/BackgroundBlock';
import ShadowWrapper from '../../common/ShadowWrapper';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import {useDispatch, useSelector} from 'react-redux';
import {fetchLogin, selectorsUser} from '../../../redux/user/userReducer';
import GoogleCaptcha from '../../common/GoogleCaptcha';

const CELL_COUNT = 4;

const VerificationScreen = ({navigation, route}: VerificationScreenProps) => {
  const dispatch = useDispatch();
  const isLoadingUser = useSelector(selectorsUser.getLoading);
  const errorUser = useSelector(selectorsUser.getError);
  const {phone} = route.params;
  const insets = useSafeAreaInsets();
  const {errorColor, background, primary, border} = useTheme();
  const [time, setTime] = useState(90);
  const [isReadySendCode, setIsReadySendCode] = useState(false);
  const {isLoading, request} = useAxios(service.sendLoginCode);
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

  const handleAgainSendCode = async (token: string) => {
    if (isLoading) {
      return;
    }
    const res = await request({
      phone,
      token,
    });
    setIsReadySendCode(false);

    if (res.success) {
      runTime();
    }
  };

  useDidUpdateEffect(() => {
    const valueStr = String(value);
    if (valueStr.length === CELL_COUNT) {
      dispatch(fetchLogin(phone, valueStr)).then((res) => {
        console.log(res);

        if (res.success) {
        } else {
          setValue('');
        }
      });
    }
  }, [value]);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {isReadySendCode && <GoogleCaptcha onConfirm={handleAgainSendCode} />}
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
              {t('codeConfirm1') + ' '}
              <MyText
                style={{
                  fontFamily: getFontFamily('500'),
                }}>
                {formatPhone(phone)}{' '}
              </MyText>
              {t('codeConfirm2')}
            </MyText>
          </View>
          <BackgroundBlock>
            <CodeField
              ref={ref}
              {...props}
              editable={!isLoadingUser}
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              selectionColor={primary}
              renderCell={({index, symbol, isFocused}) => (
                <ShadowWrapper
                  style={{
                    shadowColor: 'rgb(160, 160, 160);',
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 6,
                    borderRadius: sizes[2],
                  }}
                  key={index}>
                  <View
                    style={{
                      backgroundColor: background,
                      borderRadius: sizes[2],
                      borderColor: isFocused ? primary : border,
                      borderWidth: 1,
                    }}>
                    <MyText
                      style={[styles.cell]}
                      onLayout={getCellOnLayoutHandler(index)}>
                      {symbol || (isFocused ? <Cursor /> : null)}
                    </MyText>
                  </View>
                </ShadowWrapper>
              )}
            />
          </BackgroundBlock>
          <MyText
            style={{
              marginTop: sizes[6],
              marginBottom: sizes[6],
              color: errorColor,
            }}>
            {errorUser ?? ''}
          </MyText>
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: border,
              marginBottom: sizes[6],
            }}
          />
          {time <= 0 ? (
            <MyText
              style={{color: primary}}
              onPress={() => setIsReadySendCode(true)}>
              {t('authSendAgain')}
            </MyText>
          ) : (
            <MyText>
              {t('resendCode') + ' '}
              <MyText
                style={{
                  fontFamily: getFontFamily('500'),
                }}>
                {time} {t('second')}
              </MyText>
            </MyText>
          )}
        </ScrollView>
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
    marginVertical: sizes[6],
  },
  cell: {
    width: sizes[30],
    paddingVertical: sizes[8],
    height: sizes[30],
    fontSize: sizes[10],
    textAlign: 'center',
  },
});

export default VerificationScreen;
