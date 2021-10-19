import React, {useEffect, useMemo, useState} from 'react';
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
import t from '../../utils/translate';
import service from '../../services/service';

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

interface IBlockDeliveryProps {
  navigate: any;
}
const BlockDelivery = React.memo(({navigate}: IBlockDeliveryProps) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<SecondStepScreenNavigationProp>();
  const defaultDeliveryPrice = useSelector(selectorsOther.getIdDeliveryPrice);
  const defaultDeliveryPriceExpress = useSelector(
    selectorsOther.getIDDefaultDeliveryPriceExpress,
  );
  const {border, primary} = useTheme();
  const sellPoints = useSelector(getSellPoints(false));
  const items = useSelector(selectorsCart.getCartProducts);
  const deliveryTypes = useSelector(selectorsTypes.getDeliveryTypes);
  const ID_SELL_POINT = useSelector(selectorsOther.getIdSellPoint);
  const isExpress = useSelector(selectorsOrder.isDeliveryExpress);
  const idSellPoint = useSelector(selectorsOrder.getSellPointId);
  const deliveryType = useSelector(selectorsOrder.getDeliveryType);
  const products = useSelector(selectorsCart.getCartProducts);
  const isLoading = useSelector(selectorsCart.getIsLoading);
  const count = useSelector(selectorsCart.getCountProduct);
  const addresses = useSelector(selectorsUser.getAddresses);
  const addressId = useSelector(selectorsOrder.getAddressId);
  const expressSellPoint = useSelector(selectorsOrder.getExpressSellPoint);
  const [pressId, setPressId] = useState(0);

  const availableSellPoints = useMemo(() => {
    const items = sellPoints.map((s) => s.id);
    if (expressSellPoint) {
      items.push(expressSellPoint.id);
    }
    return getAvailableSellPoints(items, products);
  }, [count]);

  const isAvailableExpress = () => {
    return (
      isExpress &&
      expressSellPoint &&
      availableSellPoints.some((a) => a === expressSellPoint.id)
    );
  };

  const handleSetDeliveryType = async (code: TypeDelivery) => {
    if (isLoading) return;
    if (deliveryType && deliveryType.code === code) {
      return;
    }
    if (!deliveryType) {
      return;
    }

    const idDeliveryType = deliveryType.id;

    if (code === TypeDelivery.courier) {
      const res = await dispatch(
        fetchUpdateCart(products, ID_SELL_POINT, idDeliveryType),
      );
      if (!res) {
        return;
      }
    } else if (idSellPoint) {
      let res = await dispatch(
        fetchUpdateCart(products, idSellPoint, idDeliveryType),
      );

      if (!res) {
        res = await dispatch(
          fetchUpdateCart(products, ID_SELL_POINT, idDeliveryType),
        );
        if (!res) {
          return;
        }
        dispatch(
          actionsOrder.setData({
            sellPoint: ID_SELL_POINT,
          }),
        );
      }
    }
    dispatch(
      actionsOrder.setData({
        deliveryType: deliveryTypes.find((d) => d.code === code)!,
      }),
    );
  };

  const handlePressSellPoint = async (id: number) => {
    if (isLoading) return;

    if (!deliveryType) {
      return;
    }

    const idDeliveryType = deliveryType.id;
    setPressId(id);
    const res: any = await dispatch(
      fetchUpdateCart(products, id, idDeliveryType),
    );
    if (res) {
      dispatch(
        actionsOrder.setData({
          sellPoint: id,
          date: null,
          time: '',
        }),
      );
    }
  };

  useEffect(() => {
    if (!deliveryType) {
      handleSetDeliveryType(TypeDelivery.self);
    }
  }, []);

  useEffect(() => {
    if (addressId === -1 && addresses.length > 0) {
      dispatch(
        actionsOrder.setData({
          addressId: addresses[0].id,
        }),
      );

      if (isExpress) {
        return;
      }
      try {
        const data = addresses[0];
        dispatch(
          actionsOrder.setData({
            idDeliveryPrice: data.addressDictionary!.district.deliveryPrice.id,
          }),
        );
      } catch (e) {
        dispatch(
          actionsOrder.setData({
            idDeliveryPrice: defaultDeliveryPrice,
          }),
        );
      }
    }
  }, [addressId, addresses, isExpress]);

  useEffect(() => {
    if (deliveryType?.code === TypeDelivery.express) {
      dispatch(
        actionsOrder.setData({
          idDeliveryPrice: defaultDeliveryPriceExpress,
        }),
      );
    } else if (addressId !== -1) {
      try {
        const data = addresses.find((a) => a.id === addressId)!;

        dispatch(
          actionsOrder.setData({
            idDeliveryPrice: data.addressDictionary!.district.deliveryPrice.id,
          }),
        );
      } catch (e) {
        dispatch(
          actionsOrder.setData({
            idDeliveryPrice: defaultDeliveryPrice,
          }),
        );
      }
    }
  }, [deliveryType]);

  const isOneOfDeliveryTypes = (type: TypeDelivery) => {
    return (
      deliveryTypes.some((d) => d.code === TypeDelivery.self) &&
      deliveryType &&
      deliveryType.code === type
    );
  };

  return (
    <View>
      <View style={styles.typeDelivery}>
        <React.Fragment>
          {isOneOfDeliveryTypes(TypeDelivery.self) && (
            <MyButton
              isActive={
                deliveryType ? deliveryType.code === TypeDelivery.self : false
              }
              onPress={() => handleSetDeliveryType(TypeDelivery.self)}
              styleText={styles.btnText}
              style={styles.btn}
              type={'default'}>
              {t('btnSelf')}
            </MyButton>
          )}
          {isOneOfDeliveryTypes(TypeDelivery.courier) && (
            <MyButton
              isActive={
                deliveryType
                  ? deliveryType.code === TypeDelivery.courier
                  : false
              }
              onPress={() => handleSetDeliveryType(TypeDelivery.courier)}
              styleText={styles.btnText}
              style={styles.btn}
              type={'default'}>
              {t('btnDelivery')}
            </MyButton>
          )}
        </React.Fragment>
      </View>
      {deliveryType !== null &&
        (deliveryType.code === TypeDelivery.self ? (
          sellPoints
            .filter((s) => s.id === idSellPoint)
            .map((s) => {
              return (
                <RadioBlock
                  key={s.id}
                  onPress={() => handlePressSellPoint(s.id)}
                  title={s.name}
                  text={s.address!}
                  styleCon={styles.block}
                  isActive={idSellPoint === s.id}
                  isLoading={isLoading && pressId === s.id}
                  disabled={!availableSellPoints.some((a) => a === s.id)}
                />
              );
            })
        ) : (
          <View
            style={{alignItems: addressId === -1 ? 'flex-start' : 'stretch'}}>
            <MyText style={styles.title}>{t('commonAddress')}</MyText>
            {addressId === -1 ? (
              <MyText
                onPress={() => {
                  navigation.navigate('AddressNavigator', {
                    screen: 'Address',
                  });
                }}
                style={[
                  styles.address,
                  {
                    color: primary,
                  },
                ]}>
                {t('btnTextAddAddress')}
              </MyText>
            ) : (
              <MyTextInput
                editable={false}
                multiline={true}
                viewOnTouch={() => {
                  navigation.push('OrderAddress', {
                    id: addressId!,
                    navigate,
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
    flexDirection: 'column',
    marginBottom: sizes[8],
  },
  btn: {
    marginBottom: sizes[5],
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
