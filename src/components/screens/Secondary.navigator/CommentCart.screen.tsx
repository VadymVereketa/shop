import React, {useCallback, useEffect, useState} from 'react';
import {
  BackHandler,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  SafeAreaView,
  View,
} from 'react-native';
import CartItem from '../../common/CartItem';
import {sizes, useTheme} from '../../../context/ThemeContext';
import MyTextInput from '../../controls/MyTextInput';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
  useResponsiveHeight,
} from 'react-native-responsive-dimensions';
import {ScrollView} from 'react-native-gesture-handler';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {actionsCart} from '../../../redux/cart/cartReducer';
import getUrlImg from '../../../utils/getUrlImg';
import MyText from '../../controls/MyText';
import {ICartItem} from '../../../typings/FetchData';
import {getFontFamily} from '../../../utils/getFontFamily';
import CheckBox from '../../controls/CheckBox';
import MyButton from '../../controls/MyButton';
import t from '../../../utils/translate';
import {isIOS} from '../../../utils/isPlatform';

const CommentCartScreen = React.memo(({navigation, route}: any) => {
  const dispatch = useDispatch();
  const {border, accent, background, primary} = useTheme();
  const insets = useSafeAreaInsets();
  const item: ICartItem = route.params.item;
  const [comment, setComment] = useState(item.comment);
  const [selectedServices, setSelectedServices] = useState(item.services || []);

  const handleCheck = (id: number) => {
    const findIndex = selectedServices.findIndex((s) => s === id);
    if (findIndex === -1) {
      setSelectedServices((services) => {
        return [...services, id];
      });
    } else {
      setSelectedServices((services) => {
        return services.filter((_, i) => i !== findIndex);
      });
    }
  };

  const saveComment = () => {
    dispatch(
      actionsCart.setComment({
        comment,
        id: item.product.id,
        services: selectedServices,
      }),
    );
    navigation.goBack();
  };

  const services = item.product.services || [];

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={responsiveScreenHeight(13.5)}
      behavior={isIOS ? 'padding' : undefined}
      contentContainerStyle={{}}
      style={{
        flex: 1,
        paddingHorizontal: sizes[6],
        marginBottom: insets.bottom,
      }}>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          flexGrow: 1,
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            borderColor: primary,
            borderWidth: 1,
            borderRadius: sizes[1],
          }}>
          <MyTextInput
            value={comment}
            onChangeText={setComment}
            styleWrapper={{
              borderWidth: 0,
              borderBottomWidth: 1,
            }}
          />
          {services.length > 0 && (
            <View
              style={{
                paddingHorizontal: sizes[8],
                paddingVertical: sizes[6],
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}>
              <MyText
                style={{
                  width: '100%',
                  marginBottom: sizes[8],
                }}>
                {t('commonWishes') + ':'}
              </MyText>
              {item.product.services.map((service) => {
                return (
                  <CheckBox
                    styleCon={{
                      width: responsiveScreenWidth(41),
                      marginBottom: sizes[5],
                    }}
                    value={service.id}
                    onChecked={handleCheck}
                    isChecked={selectedServices.some((s) => s === service.id)}
                    title={service.name}
                  />
                );
              })}
            </View>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <MyButton
            onPress={() => {
              navigation.goBack();
            }}
            styleText={{
              color: primary,
            }}
            ultraWidth
            style={{
              backgroundColor: background,
              width: '48%',
            }}>
            {t('btnCancel')}
          </MyButton>
          <MyButton
            onPress={saveComment}
            ultraWidth
            style={{
              width: '48%',
            }}>
            {t('btnAdd')}
          </MyButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  con: {
    marginHorizontal: sizes[5],
    justifyContent: 'space-between',
    flex: 1,
  },
  item: {
    paddingVertical: sizes[10],
    paddingHorizontal: sizes[5],
    flexDirection: 'row',
    marginHorizontal: -sizes[5],

    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    elevation: 4,
  },
  title: {
    fontSize: sizes[9],
    fontFamily: getFontFamily('500'),
    marginLeft: sizes[5],
    maxWidth: '60%',
  },
});
export default CommentCartScreen;
