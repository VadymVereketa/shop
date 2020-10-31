import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  NativeViewGestureHandlerProperties,
  TextInput,
} from 'react-native-gesture-handler';
import {
  Keyboard,
  StyleProp,
  StyleSheet,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import MyText from './MyText';
import {sizes, useTheme} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import {IName} from '../common/DesignIcon';
import IconButton from './IconButton';
import Animated, {Easing, timing} from 'react-native-reanimated';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import debounce from 'lodash.debounce'; // 4.0.8

type IMyTextInput = NativeViewGestureHandlerProperties &
  TextInputProps & {
    label?: string;
    isClear?: boolean;
    afterIcon?: {
      name: IName;
      onPress: any;
      isStroke?: boolean;
    };
    styleLabel?: StyleProp<TextStyle>;
    styleCon?: StyleProp<ViewStyle>;
    error?: string;
    viewOnTouch?: any;
    onClear?: any;
  };

const paddingAfterIcon = sizes[8];
const sizeAfterIcon = sizes[9];

const MyTextInput = React.memo(
  ({
    label,
    value,
    keyboardType,
    onChangeText,
    onFocus,
    onBlur,
    isClear = false,
    error = '',
    style = undefined,
    styleCon = undefined,
    styleLabel = undefined,
    viewOnTouch,
    afterIcon,
    onClear,
    placeholder,
    ...props
  }: IMyTextInput) => {
    const animError = useRef(new Animated.Value(-sizes[10])).current;
    let {border, lightText, primary, text, errorColor, background} = useTheme();
    const [isFocus, setIsFocus] = useState(false);
    const [isOpenEye, setIsOpenEye] = useState(
      keyboardType === 'visible-password',
    );

    const isPassword = keyboardType === 'visible-password';

    const clear = () => {
      if (onChangeText) onChangeText('');
      if (onClear) onClear();
    };

    const handleTogglePassword = () => {
      setIsOpenEye((e) => !e);
    };

    if (isPassword) {
      afterIcon = {
        name: isOpenEye ? 'eye' : 'open-eye',
        onPress: handleTogglePassword,
      };
    }

    if (error !== '') {
      border = errorColor;
    }
    const handleFocus = (e: any) => {
      if (onFocus) {
        onFocus(e);
      }
      setIsFocus(true);
    };

    const handleBlur = (e: any) => {
      if (onBlur) {
        onBlur(e);
      }
      setIsFocus(false);
    };

    const handleTouchStart = useCallback(
      debounce(
        () => {
          viewOnTouch && viewOnTouch();
        },
        300,
        {
          leading: true,
          trailing: false,
        },
      ),
      [viewOnTouch],
    );

    useDidUpdateEffect(() => {
      timing(animError, {
        duration: 200,
        toValue: error === '' ? -sizes[10] : 0,
        easing: Easing.ease,
      }).start();
    }, [error]);

    return (
      <View style={styleCon} onTouchStart={handleTouchStart}>
        {label && (
          <MyText style={[styles.textLabel, styleLabel]}>{label}</MyText>
        )}
        <View
          style={[
            styles.con,
            {
              borderColor: isFocus ? primary : border,
              backgroundColor: background,
            },
          ]}>
          <TextInput
            selectionColor={primary}
            placeholderTextColor={lightText}
            style={[styles.textInput, {color: text}, style]}
            maxFontSizeMultiplier={1.5}
            autoCapitalize={'none'}
            onSubmitEditing={Keyboard.dismiss}
            secureTextEntry={isOpenEye}
            keyboardType={isPassword ? 'default' : keyboardType}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={
              props.textContentType === 'telephoneNumber'
                ? '38 050 000 00 01'
                : placeholder
            }
            {...props}
          />
          {(isClear || afterIcon) && (
            <View
              style={[
                styles.icons,
                {flexDirection: afterIcon ? 'row' : 'row-reverse'},
              ]}>
              {isClear && value !== '' && (
                <IconButton
                  onPress={clear}
                  style={{
                    paddingHorizontal: afterIcon ? sizes[5] : paddingAfterIcon,
                  }}
                  icon={{
                    name: 'close',
                    fill: text,
                    size: afterIcon ? sizes[7] : sizeAfterIcon,
                  }}
                />
              )}
              <View
                style={[
                  styles.split,
                  {backgroundColor: isFocus ? primary : border},
                ]}
              />
              {afterIcon && (
                <IconButton
                  style={styles.icon}
                  onPress={afterIcon.onPress}
                  icon={{
                    name: afterIcon.name,
                    fill: text,
                    size: sizeAfterIcon,
                    stroke: afterIcon.isStroke ? text : undefined, //todo
                  }}
                />
              )}
            </View>
          )}
        </View>
        <Animated.View
          style={[
            styles.error,
            {
              transform: [
                {
                  translateY: animError,
                },
              ],
            },
          ]}>
          <MyText style={[styles.errorText, {color: errorColor}]}>
            {error}
          </MyText>
        </Animated.View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  error: {
    position: 'absolute',
    bottom: 0,
    zIndex: -10,
  },
  errorText: {
    fontSize: sizes[7],
  },
  textLabel: {
    fontSize: sizes[8],
    paddingBottom: sizes[3],
    margin: 0,
    fontFamily: getFontFamily('500'),
  },
  con: {
    borderWidth: 1,
    borderRadius: sizes[1],
    flexDirection: 'row',
    paddingVertical: sizes[1],
  },
  textInput: {
    fontSize: sizes[9],
    margin: 0,
    flex: 1,
    padding: 0,
    alignItems: 'center',
    paddingHorizontal: sizes[8],
    paddingVertical: sizes[5],
    fontFamily: getFontFamily('300'),
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    paddingHorizontal: paddingAfterIcon,
    borderRadius: sizes[1],
  },
  split: {
    width: 1,
    height: '100%',
  },
});

export default MyTextInput;
