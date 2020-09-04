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
  View,
} from 'react-native';
import CartItem from '../../common/CartItem';
import {sizes, useTheme} from '../../../context/ThemeContext';
import MyTextInput from '../../controls/MyTextInput';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  responsiveHeight,
  responsiveScreenHeight,
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

const CommentCartScreen = React.memo(({navigation, route}: any) => {
  const dispatch = useDispatch();
  const mb = responsiveScreenHeight(40);
  const [hKeyboard, sethKeyboard] = useState(mb);
  const {border, background} = useTheme();
  const insets = useSafeAreaInsets();
  const item: ICartItem = route.params.item;
  const [comment, setComment] = useState(item.comment);

  useFocusEffect(
    useCallback(() => {
      Keyboard.addListener('keyboardDidShow', handleKeyboard);
      Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

      return () => {
        Keyboard.removeListener('keyboardDidShow', handleKeyboard);
        Keyboard.removeListener('keyboardDidHide', handleKeyboardHide);
      };
    }, []),
  );

  const handleKeyboard = (event) => {
    sethKeyboard((h) => {
      return h === 0 ? sizes[10] : event.endCoordinates.height;
    });
  };

  const handleKeyboardHide = (event) => {
    Platform.OS === 'android' && navigation.goBack();
  };

  const saveComment = () => {
    dispatch(
      actionsCart.setComment({
        comment,
        id: item.product.id,
      }),
    );
    Platform.OS === 'ios' && navigation.goBack();
  };

  const imgId =
    item.product.productImages.length > 0
      ? item.product.productImages[0].uuid
      : null;
  const title = item.product.title;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : (null as any)}
      style={{flex: 1}}>
      <View
        style={[
          styles.con,
          {marginBottom: insets.bottom + insets.top + sizes[4]},
        ]}>
        <View
          style={[
            styles.item,
            {
              backgroundColor: background,
            },
          ]}>
          <Image
            source={getUrlImg(imgId)}
            resizeMode={'cover'}
            style={{
              width: sizes[37],
              height: sizes[25],
            }}
          />
          <MyText style={styles.title}>{title}</MyText>
        </View>
        <View
          style={{
            marginHorizontal: -sizes[5],
            borderColor: border,
            borderWidth: 1,
            paddingVertical: sizes[5],
            paddingHorizontal: sizes[10],
            backgroundColor: background,
            paddingBottom: Platform.OS === 'ios' ? sizes[5] : hKeyboard,
          }}>
          <ScrollView
            contentContainerStyle={{maxHeight: 100}}
            bounces={false}
            keyboardDismissMode={'none'}>
            <MyTextInput
              autoFocus
              numberOfLines={2}
              multiline={true}
              maxLength={120}
              onSubmitEditing={(e) => {
                console.log(e);
              }}
              afterIcon={{
                name: 'send',
                onPress: saveComment,
              }}
              value={comment}
              onChangeText={setComment}
            />
          </ScrollView>
        </View>
      </View>
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
