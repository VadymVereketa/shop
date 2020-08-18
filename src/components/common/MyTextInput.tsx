import React, {useEffect, useRef, useState} from 'react';
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
import {IName} from './DesignIcon';
import IconButton from './IconButton';
import Animated, {Easing, timing} from 'react-native-reanimated';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';

type IMyTextInput = NativeViewGestureHandlerProperties &
  TextInputProps & {
    label?: string;
    isClear?: boolean;
    afterIcon?: {
      name: IName;
      onPress: any;
    };
    styleLabel?: StyleProp<TextStyle>;
    styleCon?: StyleProp<ViewStyle>;
    error?: string;
  };

const paddingAfterIcon = sizes[8];
const sizeAfterIcon = sizes[9];

const MyTextInput = ({
  label,
  value,
  keyboardType,
  onChangeText,
  onFocus,
  onBlur,
  isClear = false,
  error = '',
  style = {},
  styleCon = {},
  styleLabel = {},
  afterIcon,
  ...props
}: IMyTextInput) => {
  const animError = useRef(new Animated.Value(-sizes[10])).current;
  let {border, lightText, primary, text, errorColor} = useTheme();
  const [isFocus, setIsFocus] = useState(false);
  const [isOpenEye, setIsOpenEye] = useState(
    keyboardType === 'visible-password',
  );

  const isPassword = keyboardType === 'visible-password';

  const clear = () => {
    if (onChangeText) onChangeText('');
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

  useDidUpdateEffect(() => {
    timing(animError, {
      duration: 200,
      toValue: error === '' ? -sizes[10] : 0,
      easing: Easing.ease,
    }).start();
  }, [error]);

  return (
    <View style={styleCon}>
      {label && <MyText style={[styles.textLabel, styleLabel]}>{label}</MyText>}
      <View style={[styles.con, {borderColor: isFocus ? primary : border}]}>
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
        <MyText style={[styles.errorText, {color: errorColor}]}>{error}</MyText>
      </Animated.View>
    </View>
  );
};

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
    height: sizes[23],
    backgroundColor: 'white',
  },
  textInput: {
    fontSize: sizes[9],
    margin: 0,
    flex: 1,
    padding: 0,
    alignItems: 'center',
    paddingHorizontal: sizes[8],
    fontFamily: getFontFamily('300'),
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    paddingHorizontal: paddingAfterIcon,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: sizes[1],
  },
  split: {
    width: 1,
    height: sizes[20],
  },
});

export default MyTextInput;
