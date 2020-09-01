import React, {useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getSellPoints} from '../../redux/sellPoints/sellPointsReducer';
import {sizes, useTheme} from '../../context/ThemeContext';
import MyButton from '../controls/MyButton';
import {getFontFamily} from '../../utils/getFontFamily';
import {selectorsTypes} from '../../redux/types/typeReducer';
import {selectorsOther} from '../../redux/other/otherReducer';
import {TypeDelivery} from '../../constants/constantsId';
import {actionsOrder, selectorsOrder} from '../../redux/order/orderReducer';
import RadioBlock from '../controls/RadioBlock';
import {ICartItem} from '../../typings/FetchData';
import {
  actionsCart,
  fetchUpdateCart,
  selectorsCart,
} from '../../redux/cart/cartReducer';
import MyText from '../controls/MyText';
import {selectorsUser} from '../../redux/user/userReducer';
import {formatAddress} from '../../utils/formatAddress';
import MyTextInput from '../controls/MyTextInput';
import {useNavigation} from '@react-navigation/native';
import {SecondStepScreenNavigationProp} from '../navigators/Order.navigator';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

const getAvailableSellPoints = (
  sellPointsId: number[],
  products: ICartItem[],
) => {
  const res: number[] = [];
  sellPointsId.forEach((sellPointId) => {
    const arr = products.map((p) =>
      p.product.productOptions.map((po) => ({
        id: po.sellPoint.id,
        available: po.available,
      })),
    );
    let isAdd = false;
    for (const a of arr) {
      isAdd = a.some((id) => id.id === sellPointId && id.available);
      if (!isAdd) break;
    }
    if (isAdd) {
      res.push(sellPointId);
    }
  });

  return res;
};

const BlockDelivery = React.memo(() => {
  const dispatch = useDispatch();
  const navigation = useNavigation<SecondStepScreenNavigationProp>();
  const {border, primary} = useTheme();
  const sellPoints = useSelector(getSellPoints(false));
  const deliveryTypes = useSelector(selectorsTypes.getDeliveryTypes);
  const ID_SELL_POINT = useSelector(selectorsOther.getIdSellPoint);
  const idSellPoint = useSelector(selectorsOrder.getSellPoint);
  const deliveryType = useSelector(selectorsOrder.getDeliveryType);
  const products = useSelector(selectorsCart.getCartProducts);
  const isLoading = useSelector(selectorsCart.getIsLoading);
  const count = useSelector(selectorsCart.getCountProduct);
  const addresses = useSelector(selectorsUser.getAddresses);
  const addressId = useSelector(selectorsOrder.getAddressId);

  const availableSellPoints = useMemo(() => {
    return getAvailableSellPoints(
      sellPoints.map((s) => s.id),
      products,
    );
  }, [count]);

  const handleSetDeliveryType = (code: TypeDelivery) => {
    if (deliveryType && deliveryType.code === code) {
      return;
    }
    if (code === TypeDelivery.courier) {
      dispatch(fetchUpdateCart(products, ID_SELL_POINT));
    } else if (idSellPoint) {
      dispatch(fetchUpdateCart(products, idSellPoint));
    }
    dispatch(
      actionsOrder.setData({
        deliveryType: deliveryTypes.find((d) => d.code === code)!,
      }),
    );
  };

  const handlePressSellPoint = async (id: number) => {
    const res: any = await dispatch(fetchUpdateCart(products, id));
    if (res) {
      dispatch(
        actionsOrder.setData({
          sellPoint: id,
        }),
      );
    }
  };

  useEffect(() => {
    handleSetDeliveryType(TypeDelivery.self);
    return () => {
      dispatch(actionsCart.updateCart(-1));
    };
  }, []);

  useEffect(() => {
    if (addressId === -1 && addresses.length > 0) {
      dispatch(
        actionsOrder.setData({
          addressId: addresses[0].id,
        }),
      );
    }
  }, [addressId, addresses]);

  return (
    <View>
      <View style={styles.typeDelivery}>
        {deliveryTypes.some((d) => d.code === TypeDelivery.self) && (
          <MyButton
            isActive={
              deliveryType ? deliveryType.code === TypeDelivery.self : false
            }
            onPress={() => handleSetDeliveryType(TypeDelivery.self)}
            styleText={styles.btnText}
            style={{width: '47%', marginRight: sizes[5]}}
            type={'default'}>
            Забрати особисто
          </MyButton>
        )}
        {deliveryTypes.some((d) => d.code === TypeDelivery.courier) && (
          <MyButton
            isActive={
              deliveryType ? deliveryType.code === TypeDelivery.courier : false
            }
            onPress={() => handleSetDeliveryType(TypeDelivery.courier)}
            style={{width: '47%', marginLeft: sizes[5]}}
            styleText={styles.btnText}
            type={'default'}>
            Доставка
          </MyButton>
        )}
      </View>
      {deliveryType !== null &&
        (deliveryType.code === TypeDelivery.self ? (
          sellPoints.map((s) => {
            return (
              <RadioBlock
                key={s.id}
                onPress={() => handlePressSellPoint(s.id)}
                title={s.name}
                text={s.address!}
                styleCon={styles.block}
                isActive={idSellPoint === s.id}
                disabled={
                  isLoading || !availableSellPoints.some((a) => a === s.id)
                }
              />
            );
          })
        ) : (
          <View
            style={{alignItems: addressId === -1 ? 'flex-start' : 'stretch'}}>
            <MyText style={styles.title}>Адреса</MyText>
            {addressId === -1 ? (
              <MyText
                onPress={() => {
                  navigation.replace('AddressNavigator', {
                    screen: 'Address',
                  });
                }}
                style={[
                  styles.address,
                  {
                    color: primary,
                  },
                ]}>
                + Додати адресу
              </MyText>
            ) : (
              <MyTextInput
                editable={false}
                viewOnTouch={() => {
                  navigation.push('OrderAddress', {
                    id: addressId!,
                  });
                }}
                afterIcon={{
                  onPress: () => null,
                  name: 'next',
                }}
                value={formatAddress(addresses.find((a) => a.id === addressId))}
              />
            )}
          </View>
        ))}
    </View>
  );
});

const styles = StyleSheet.create({
  typeDelivery: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: sizes[8],
  },
  block: {
    marginBottom: sizes[5],
  },
  btnText: {
    fontFamily: getFontFamily('500'),
  },
  title: {
    fontFamily: getFontFamily('500'),
    marginTop: sizes[5],
    marginBottom: sizes[8],
  },
  box: {
    borderWidth: 1,
    borderRadius: 1,
  },
  text: {
    padding: sizes[5],
  },
  address: {
    paddingVertical: sizes[5],
  },
});
export default BlockDelivery;
