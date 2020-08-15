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
  };

const paddingAfterIcon = sizes[8];
const sizeAfterIcon = sizes[9];

const MyTextInput = ({
  label,
  value,
  keyboardType,
  onChangeText,
  isClear = false,
  style = {},
  styleCon = {},
  styleLabel = {},
  afterIcon,
  ...props
}: IMyTextInput) => {
  const {border, lightText, primary, text} = useTheme();
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

  return (
    <View>
      {label && <MyText style={[styles.textLabel, styleLabel]}>{label}</MyText>}
      <View style={[styles.con, {borderColor: border}, styleCon]}>
        <TextInput
          selectionColor={primary}
          placeholderTextColor={lightText}
          style={[styles.textInput, style]}
          maxFontSizeMultiplier={1.5}
          autoCapitalize={'none'}
          onSubmitEditing={Keyboard.dismiss}
          secureTextEntry={isOpenEye}
          keyboardType={isPassword ? 'default' : keyboardType}
          value={value}
          onChangeText={onChangeText}
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
                  flex: 1,
                  justifyContent: 'center',
                }}
                icon={{
                  name: 'close',
                  fill: text,
                  size: afterIcon ? sizes[7] : sizeAfterIcon,
                }}
              />
            )}
            <View style={[styles.split, {backgroundColor: border}]} />
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
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
  textInput: {
    fontSize: sizes[9],
    margin: 0,
    flex: 1,
    padding: 0,
    alignItems: 'center',
    paddingHorizontal: sizes[8],
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
  },
  split: {
    width: 1,
    height: sizes[20],
  },
});

export default MyTextInput;
