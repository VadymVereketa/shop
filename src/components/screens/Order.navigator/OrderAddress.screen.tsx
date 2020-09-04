import React, {useState} from 'react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {OrderAddressScreenProps} from '../../navigators/Order.navigator';
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {StyleSheet, View} from 'react-native';
import MyButton from '../../controls/MyButton';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {useSelector} from 'react-redux';
import {selectorsUser} from '../../../redux/user/userReducer';
import MyText from '../../controls/MyText';
import {formatAddress} from '../../../utils/formatAddress';
import DesignIcon from '../../common/DesignIcon';

const OrderAddressScreen = ({navigation, route}: OrderAddressScreenProps) => {
  const insets = useSafeAreaInsets();
  const {border, primary, text, background} = useTheme();
  const addresses = useSelector(selectorsUser.getAddresses);
  const [address, setAddress] = useState(route.params.id);

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    navigation.navigate(route.params.navigate, {
      idAddress: address,
    });
  };

  const handleAddAddress = () => {
    navigation.push('AddressNavigator', {
      screen: 'Address',
    });
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          marginTop: -insets.top,
        },
      ]}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {addresses.map((a) => {
          return (
            <TouchableWithoutFeedback
              onPress={() => setAddress(a.id)}
              style={[styles.item, {borderBottomColor: border}]}>
              <MyText
                style={[
                  styles.text,
                  {
                    color: address === a.id ? primary : text,
                  },
                ]}>
                {formatAddress(a)}
              </MyText>
              <View style={styles.iconView}>
                <DesignIcon
                  name={'check-mark'}
                  size={sizes[10]}
                  fill={address === a.id ? primary : background}
                />
              </View>
            </TouchableWithoutFeedback>
          );
        })}
        <MyText
          onPress={handleAddAddress}
          style={[
            styles.address,
            {
              color: primary,
            },
          ]}>
          + Додати адресу
        </MyText>
      </ScrollView>
      <View style={styles.btns}>
        <MyButton
          onPress={handleCancel}
          type={'default'}
          containerStyle={styles.btn}
          isActive
          styleText={styles.btnText}>
          скасувати
        </MyButton>
        <MyButton
          onPress={handleSubmit}
          containerStyle={styles.btn}
          styleText={styles.btnText}>
          зберегти
        </MyButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: sizes[5],
    justifyContent: 'space-between',
    flex: 1,
  },
  btns: {
    flexDirection: 'row',
    marginHorizontal: -(sizes[5] / 2),
    marginBottom: sizes[5],
  },
  btnText: {
    fontSize: sizes[9],
  },
  btn: {
    marginHorizontal: sizes[5],
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingVertical: sizes[8],
    paddingLeft: sizes[8],
  },
  text: {
    fontSize: sizes[9],
    flexShrink: 1,
  },
  iconView: {
    paddingRight: sizes[8],
  },
  address: {
    paddingVertical: sizes[5],
    textAlign: 'right',
  },
});
export default OrderAddressScreen;
