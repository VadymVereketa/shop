import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {sizes, useTheme} from '../../context/ThemeContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import IconButton from '../controls/IconButton';
import MyTextInput from '../controls/MyTextInput';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  timing,
} from 'react-native-reanimated';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import {
  Switch,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Logo from './Logo';
import t from '../../utils/translate';
import {useDispatch, useSelector} from 'react-redux';
import {actionsOrder, selectorsOrder} from '../../redux/order/orderReducer';
import MyText from '../controls/MyText';
import {actionsOther, selectorsOther} from '../../redux/other/otherReducer';
import useGetTranslateForDeliveryType from '../../useHooks/useGetTranslateForDeliveryType';
import {getSellPoints} from '../../redux/sellPoints/sellPointsReducer';
import DesignIcon from './DesignIcon';
import {getFontFamily} from '../../utils/getFontFamily';
import {actionsCart, selectorsCart} from '../../redux/cart/cartReducer';
import ModalAssortmentWarning from '../modals/ModalAssortmentWarning';

const window = Dimensions.get('window');
const height = Math.max(window.height, window.width);

interface IHeaderProps {
  isShow: boolean;
  setIsShow: any;
  onChange: any;
  initValue: string;
}
const Header = React.memo(
  ({isShow, setIsShow, onChange, initValue}: IHeaderProps) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const HEIGHT = useRef(-height);
    const isGlobalSearch = useSelector(selectorsOther.getIsGlobalSearch);
    const [search, setSearch] = useState('');
    const [isGlobal, setIsGlobal] = useState(isGlobalSearch);
    const valueY = useRef(new Animated.Value(HEIGHT.current)).current;
    const {
      text,
      background,
      lightText,
      lightBackground,
      theme,
      primary,
    } = useTheme();
    const {top, ...insets} = useSafeAreaInsets();
    const isRepeatOrder = useSelector(selectorsOrder.isRepeatOrder);
    const deliveryType = useSelector(selectorsOrder.getDeliveryType);
    const sellPoints = useSelector(getSellPoints(true));
    const orderSellPoint = useSelector(selectorsOrder.getSellPointId);
    const selectSellPoint = sellPoints.find((s) => s.id == orderSellPoint);
    const getTextDeliveryType = useGetTranslateForDeliveryType();
    const isEmptyCart = useSelector(selectorsCart.isEmpty);
    const [isOpenClearCart, setIsOpenClearCart] = useState(false);
    const idDefaultSellPoint = useSelector(selectorsOther.getIdSellPoint);

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

    useDidUpdateEffect(() => {
      setIsGlobal(isGlobalSearch);
    }, [isGlobalSearch]);

    const handleToggle = (value: boolean) => {
      setIsGlobal(value);
    };

    const handleHide = () => {
      setSearch(initValue);
      setIsShow(false);
      setIsGlobal(isGlobalSearch);
    };

    const handleOpenAssortmentModal = () => {
      if (!isEmptyCart) {
        setIsOpenClearCart(true);
        return;
      }
      dispatch(
        actionsOther.setData({
          isModalAssortment: true,
        }),
      );

      dispatch(
        actionsOrder.setData({
          deliveryType: null,
        }),
      );
    };

    const handleClearCart = () => {
      dispatch(actionsCart.clear(idDefaultSellPoint));
      dispatch(actionsCart.updateCart(idDefaultSellPoint));
      setIsOpenClearCart(false);

      dispatch(
        actionsOrder.setData({
          deliveryType: null,
        }),
      );
      dispatch(
        actionsOther.setData({
          isModalAssortment: true,
        }),
      );
    };

    const handleCloseClearCart = () => {
      setIsOpenClearCart(false);
    };

    const handleBack = () => {
      navigation.navigate('OrderNavigator', {
        screen: 'Repeat',
      });
    };

    const handleSubmit = () => {
      onChange(search);
      setIsShow(false);
      dispatch(
        actionsOther.setData({
          isGlobalSearch: isGlobal,
        }),
      );
    };

    const handleClear = () => {
      setSearch('');
      onChange('');
      dispatch(
        actionsOther.setData({
          isGlobalSearch: false,
        }),
      );
    };

    const translateY = interpolate(valueY, {
      inputRange: [HEIGHT.current, HEIGHT.current / 4],
      outputRange: [-height, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    return (
      <View
        style={[
          styles.con,
          {
            paddingTop: top ? top : 0,
            paddingLeft: insets.left ? insets.left : sizes[5],
            backgroundColor: background,
          },
        ]}>
        <ModalAssortmentWarning
          modalVisible={isOpenClearCart}
          onClose={handleCloseClearCart}
          onConfirm={handleClearCart}
        />
        {isRepeatOrder ? (
          <IconButton
            icon={{
              name: 'arrow',
              size: sizes[13],
              fill: text,
            }}
            onPress={handleBack}
          />
        ) : (
          <View>
            <Logo resizeMode={'cover'} width={sizes[38]} height={sizes[12]} />
          </View>
        )}
        {deliveryType && (
          <TouchableOpacity
            onPress={handleOpenAssortmentModal}
            style={{
              backgroundColor: lightBackground,
              flexDirection: 'row',
              alignItems: 'center',
              padding: sizes[5],
              paddingHorizontal: sizes[10],
              marginHorizontal: sizes[5],
            }}>
            <MyText
              style={{
                color: lightText,
                marginRight: sizes[6],
              }}>
              Асорт. для
            </MyText>
            <MyText
              style={{
                marginRight: sizes[6],
                fontFamily: getFontFamily('400'),
              }}>
              {getTextDeliveryType(deliveryType, selectSellPoint)}
            </MyText>
            <DesignIcon name={'settings'} size={sizes[8]} fill={text} />
          </TouchableOpacity>
        )}
        <IconButton
          style={{
            padding: sizes[5],
          }}
          onPress={() => setIsShow(true)}
          icon={{
            name: 'search',
            size: sizes[10],
            fill: text,
          }}
        />
        <Animated.View
          style={[
            styles.back,
            {
              backgroundColor: theme === 'dark' ? lightBackground : text,

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
            HEIGHT.current = -e.nativeEvent.layout.height;
          }}
          style={[
            styles.searchBar,
            {
              backgroundColor: background,
              paddingTop: top + sizes[45],
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
                onSubmitEditing={handleSubmit}
                afterIcon={{
                  name: 'close',
                  onPress: handleClear,
                }}
              />
            )}
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: sizes[7],
              }}>
              <MyText>{t('commonSearchAll')}</MyText>
              <Switch
                trackColor={{false: lightBackground, true: primary}}
                thumbColor={'white'}
                ios_backgroundColor={lightBackground}
                onValueChange={handleToggle}
                value={isGlobal}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  con: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
  },
  back: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: height,
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
    flexWrap: 'wrap',
  },
  inputCon: {
    flex: 1,
    paddingRight: sizes[5],
  },
  backIcon: {
    paddingHorizontal: sizes[7],
    marginBottom: sizes[21],
    flexGrow: 1,
  },
});

export default Header;
