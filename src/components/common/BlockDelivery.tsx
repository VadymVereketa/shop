import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getSellPoints} from '../../redux/sellPoints/sellPointsReducer';
import {sizes, useTheme} from '../../context/ThemeContext';
import MyButton from '../controls/MyButton';
import {getFontFamily} from '../../utils/getFontFamily';
import {selectorsTypes} from '../../redux/types/typeReducer';
import {actionsOther, selectorsOther} from '../../redux/other/otherReducer';
import {TypeDelivery} from '../../constants/constantsId';
import {actionsOrder, selectorsOrder} from '../../redux/order/orderReducer';
import RadioBlock from '../controls/RadioBlock';
import {ICartItem} from '../../typings/FetchData';
import {selectorsCart} from '../../redux/cart/cartReducer';
import MyText from '../controls/MyText';
import {selectorsUser} from '../../redux/user/userReducer';
import {formatAddress} from '../../utils/formatAddress';
import MyTextInput from '../controls/MyTextInput';
import {useNavigation} from '@react-navigation/native';
import {SecondStepScreenNavigationProp} from '../navigators/Order.navigator';
import t from '../../utils/translate';
import {SelectorCity} from '../../redux/city/cityReducer';

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
  const defaultDeliveryPrice = useSelector(
    SelectorCity.getDefaultDeliveryPrice,
  );
  const {border, primary} = useTheme();
  const sellPoints = useSelector(getSellPoints(false));
  const deliveryTypes = useSelector(selectorsTypes.getDeliveryTypes);
  const idSellPoint = useSelector(selectorsOrder.getSellPointId);
  const deliveryType = useSelector(selectorsOrder.getDeliveryType)!;
  const selectedCity = useSelector(SelectorCity.getSelectedCity);
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

  useEffect(() => {
    //TODO: Delete
    const address = setInitAddress();
    if (deliveryType.code === TypeDelivery.courier && selectedCity !== null) {
      if (selectedCity.id !== 1) {
        dispatch(
          actionsOrder.setData({
            idDeliveryPrice: selectedCity.setups.default_delivery_price!,
          }),
        );
        return;
      }
    }

    if (address === null) {
      return;
    }

    try {
      dispatch(
        actionsOrder.setData({
          idDeliveryPrice: address.addressDictionary!.district.deliveryPrice.id,
        }),
      );
    } catch (e) {
      dispatch(
        actionsOrder.setData({
          idDeliveryPrice: defaultDeliveryPrice?.id,
        }),
      );
    }
  }, [addressId, addresses]);

  const setInitAddress = () => {
    if (addresses.length > 0) {
      let id = addressId === -1 ? addresses[0].id : addressId;
      dispatch(
        actionsOrder.setData({
          addressId: id,
        }),
      );

      const address = addresses.find((a) => a.id === id)!;

      return address;
    }
    return null;
  };

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
              styleText={styles.btnText}
              style={styles.btn}
              type={'default'}>
              {t('btnDelivery')}
            </MyButton>
          )}
          <MyButton
            onPress={() => {
              dispatch(
                actionsOther.setData({
                  isOpenClearCart: true,
                }),
              );
            }}
            styleText={styles.btnText}
            style={styles.btn}
            type={'default'}>
            {t('changeDeliveryMethod')}
          </MyButton>
        </React.Fragment>
      </View>
      {deliveryType !== null &&
        (deliveryType.code === TypeDelivery.self ? (
          sellPoints
            .filter((s) => s.id === idSellPoint)
            .map((s) => {
              return (
                <RadioBlock
                  onPress={() => null}
                  key={s.id}
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
