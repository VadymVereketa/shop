import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import IconButton from './IconButton';
import MyTextInput from './MyTextInput';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  timing,
  add,
} from 'react-native-reanimated';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Logo from './Logo';
import t from '../../utils/translate';

const window = Dimensions.get('window');

interface IHeaderProps {
  isShow: boolean;
  setIsShow: any;
  onChange: any;
  initValue: string;
}
const Header = ({isShow, setIsShow, onChange, initValue}: IHeaderProps) => {
  const HEIGHT = useRef(-200);
  const [search, setSearch] = useState('');
  const valueY = useRef(new Animated.Value(HEIGHT.current)).current;
  const {text, background} = useTheme();
  const {top, ...insets} = useSafeAreaInsets();

  useDidUpdateEffect(() => {
    timing(valueY, {
      duration: 300,
      toValue: isShow ? 0 : HEIGHT.current,
      easing: Easing.ease,
    }).start();
  }, [isShow]);

  useDidUpdateEffect(() => {
    setSearch(initValue);
  }, [initValue]);

  const handleHide = () => {
    setSearch(initValue);
    setIsShow(false);
  };

  const translateY = interpolate(valueY, {
    inputRange: [HEIGHT.current, HEIGHT.current / 4],
    outputRange: [-window.height, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  return (
    <View
      style={[
        styles.con,
        {
          paddingTop: top ? top : sizes[7],
          paddingRight: insets.right ? insets.right : sizes[5],
          paddingLeft: insets.left ? insets.left : sizes[5],
        },
      ]}>
      <Logo resizeMode={'cover'} width={sizes[38]} height={sizes[12]} />
      <IconButton
        onPress={() => setIsShow(true)}
        icon={{
          name: 'search',
          size: sizes[12],
          fill: text,
        }}
      />
      <Animated.View
        style={[
          styles.back,
          {
            backgroundColor: text,
            transform: [
              {
                translateY,
              },
            ],
          },
        ]}>
        <TouchableWithoutFeedback
          onPress={handleHide}
          containerStyle={styles.backTouch}
        />
      </Animated.View>
      <Animated.View
        onLayout={(e) => {
          console.log(e.nativeEvent.layout.y);
          HEIGHT.current = -e.nativeEvent.layout.height;
        }}
        style={[
          styles.searchBar,
          {
            backgroundColor: background,
            paddingTop: top + sizes[30],
            transform: [
              {
                translateY: valueY,
              },
            ],
          },
        ]}>
        <IconButton
          style={styles.backIcon}
          onPress={handleHide}
          icon={{
            name: 'arrow',
            size: sizes[12],
            fill: text,
          }}
        />
        <View style={styles.inputCon}>
          {isShow && (
            <MyTextInput
              autoFocus
              placeholder={t('tiSearchPlaceholder')}
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={(e) => {
                onChange(search);
                setIsShow(false);
              }}
              afterIcon={{
                name: 'close',
                onPress: () => {
                  setSearch('');
                  onChange('');
                },
              }}
            />
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
    backgroundColor: 'white',
  },
  back: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: window.height,
    position: 'absolute',
    opacity: 0.8,
    zIndex: 100,
  },
  backTouch: {
    flex: 1,
  },
  searchBar: {
    position: 'absolute',
    flexDirection: 'row',
    left: 0,
    right: 0,
    zIndex: 100,
    paddingBottom: sizes[6],
    alignItems: 'center',
  },
  inputCon: {
    flex: 1,
    paddingRight: sizes[5],
  },
  backIcon: {
    paddingHorizontal: sizes[7],
  },
});

export default Header;
