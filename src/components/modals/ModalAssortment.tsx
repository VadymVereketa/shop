import React, {useEffect, useState} from 'react';
import {Linking, Modal, TouchableOpacity, StyleSheet, View} from 'react-native';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import {Portal} from 'react-native-portalize';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';
import {TypeDelivery} from '../../constants/constantsId';
import {sizes, useTheme} from '../../context/ThemeContext';
import {actionsCart} from '../../redux/cart/cartReducer';
import {actionsOrder, selectorsOrder} from '../../redux/order/orderReducer';
import {actionsOther, selectorsOther} from '../../redux/other/otherReducer';
import {
  getSellPoints,
  selectorSellPoint,
} from '../../redux/sellPoints/sellPointsReducer';
import {selectorsTypes} from '../../redux/types/typeReducer';
import {ISellPoint} from '../../typings/FetchData';
import IOption from '../../typings/IOption';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import {getFontFamily} from '../../utils/getFontFamily';
import {isIOS} from '../../utils/isPlatform';
import DesignIcon from '../common/DesignIcon';
import CustomModalDropdown from '../controls/CustomModalDropdown';
import MyButton from '../controls/MyButton';
import MyText from '../controls/MyText';
import MyModal from './MyModal';

interface IModalUpdateAppProps {}

const width = responsiveScreenWidth(100) - sizes[40];

const sizeCheck = sizes[25];

const ModalAssortment = () => {
  const dispatch = useDispatch();
  const {border, lightText, primary, lightBackground} = useTheme();
  const isModalAssortment = useSelector(selectorsOther.getIsModalAssortment);
  const DEFAULT_ID_SELL_POINT = useSelector(selectorsOther.getIdSellPoint);
  const deliveryTypes = useSelector(selectorsTypes.getDeliveryTypes);
  const expressSellPoints = useSelector(selectorSellPoint.getExpressSellPoints);
  const sellPoints = useSelector(getSellPoints(true));

  const idDefaultDeliveryPriceExpress = useSelector(
    selectorsOther.getIDDefaultDeliveryPriceExpress,
  );
  const idDefaultDeliveryPrice = useSelector(selectorsOther.getIdDeliveryPrice);

  const defaultDeliveryType = useSelector(selectorsOrder.getDeliveryType);
  const defaultExpressSellPoint = useSelector(
    selectorsOrder.getExpressSellPoint,
  );
  const defaultSellPoint = useSelector(selectorsOrder.getSellPoint);

  const [deliveryType, setDeliveryType] = useState(defaultDeliveryType);
  const [expressSellPoint, setExpressSellPoint] = useState(
    defaultExpressSellPoint,
  );
  const [sellPoint, setSellPoint] = useState(defaultSellPoint);

  const onClose = () => {
    dispatch(
      actionsOther.setData({
        isModalAssortment: false,
      }),
    );
  };

  useEffect(() => {
    if (deliveryTypes.length > 0) {
      handleSelectDeliveryType(TypeDelivery.courier);
    }
  }, [deliveryTypes]);

  const handleSelectDeliveryType = (type: TypeDelivery) => {
    if (type !== TypeDelivery.self) {
      setSellPoint(null);
    }
    if (type !== TypeDelivery.express) {
      setExpressSellPoint(null);
    }
    setDeliveryType(deliveryTypes.find((d) => d.code === type)!);
  };

  const handleSelectSellpoint = (data: ISellPoint) => {
    setSellPoint(data);
  };

  const handleSelectExpressSellpoint = (data: ISellPoint) => {
    setExpressSellPoint(data);
  };

  const handleConfirm = () => {
    let id: any = DEFAULT_ID_SELL_POINT;
    if (deliveryType!.code === TypeDelivery.self) {
      id = sellPoint?.id;
    } else if (deliveryType!.code === TypeDelivery.express) {
      id = expressSellPoint!.id;
    }
    dispatch(actionsCart.updateCart(id!));
    if (deliveryType!.code === TypeDelivery.courier) {
      id = -1;
    }
    dispatch(
      actionsOrder.setData({
        sellPoint: id,
        expressSellPoint: expressSellPoint,
        deliveryType: deliveryType,
      }),
    );
    onClose();
  };

  useEffect(() => {
    if (
      defaultDeliveryType &&
      defaultDeliveryType!.code === TypeDelivery.express
    ) {
      dispatch(
        actionsOrder.setData({
          idDeliveryPrice: idDefaultDeliveryPriceExpress,
        }),
      );
    }
  }, [defaultDeliveryType]);

  const getDisabledBtn = () => {
    if (!deliveryType) {
      return false;
    }
    if (deliveryType.code === TypeDelivery.self && sellPoint === null) {
      return true;
    } else if (
      deliveryType.code === TypeDelivery.express &&
      expressSellPoint === null
    ) {
      return true;
    }
    return false;
  };

  useDidUpdateEffect(() => {
    if (isModalAssortment) {
      handleSelectDeliveryType(TypeDelivery.courier);
      dispatch(
        actionsOrder.setData({
          sellPoint: null,
          expressSellPoint: null,
        }),
      );
    }
  }, [isModalAssortment]);

  const options = [
    {
      code: TypeDelivery.express,
      title: 'Експрес доставка',
      subtitle: 'Швидка доставка топ позицій',
      sellPoints: expressSellPoints.map((s) => {
        const res: IOption<string, ISellPoint> = {
          label: s.name,
          value: s,
        };
        return res;
      }),
      selected: handleSelectExpressSellpoint,
      icon: 'ExpressDelivery',
      value: expressSellPoint,
    },
    {
      code: TypeDelivery.courier,
      title: 'Доставка',
      subtitle: 'Розширений асортимент',
      icon: 'CourierDelivery',
    },
    {
      code: TypeDelivery.self,
      title: 'Самовивоз',
      subtitle: 'Асортимент обраного магазину',
      sellPoints: sellPoints.map((s) => {
        const res: IOption<string, ISellPoint> = {
          label: s.name,
          value: s,
        };
        return res;
      }),
      selected: handleSelectSellpoint,
      icon: 'SelfDelivery',
      value: sellPoint,
    },
  ];

  return (
    <MyModal
      modalVisible={isModalAssortment}
      onClose={onClose}
      style={{
        height: responsiveScreenHeight(80),
      }}
      title="Асортимент">
      <ScrollView contentContainerStyle={{}} style={{}}>
        {options.map((opt, i) => {
          const isMiddle = i > 0 && i < options.length - 1;
          return (
            <View
              style={{
                alignItems: 'center',
                paddingVertical: sizes[10],
                backgroundColor:
                  deliveryType?.code === opt.code
                    ? 'rgba(200, 235, 249, 1)'
                    : undefined,
                borderTopWidth: isMiddle ? 1 : 0,
                borderBottomWidth: isMiddle ? 1 : 0,
                borderTopColor: border,
                borderBottomColor: border,
              }}>
              <TouchableOpacity
                activeOpacity={0.1}
                onPress={() => handleSelectDeliveryType(opt.code)}
                style={{
                  borderColor: primary,
                  borderWidth: 1,
                  width: sizeCheck,
                  height: sizeCheck,
                  borderRadius: sizeCheck / 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: lightBackground,
                  position: 'absolute',
                  right: sizes[10],
                  top: sizes[10],
                }}>
                {deliveryType?.code === opt.code && (
                  <DesignIcon
                    name={'check-mark'}
                    size={sizeCheck / 3}
                    fill={primary}
                  />
                )}
              </TouchableOpacity>
              <DesignIcon name={opt.icon} size={sizes[70]} />
              <MyText
                style={{
                  fontFamily: getFontFamily('400'),
                  fontSize: sizes[9],
                  marginBottom: sizes[1],
                  marginTop: sizes[5],
                }}>
                {opt.title}
              </MyText>
              <MyText
                style={{
                  color: lightText,
                  marginBottom: sizes[2],
                }}>
                {opt.subtitle}
              </MyText>
              {opt.sellPoints && (
                <CustomModalDropdown<ISellPoint>
                  animated={false}
                  label=""
                  options={opt.sellPoints as any[]}
                  onSelect={(item1) => {
                    opt.selected(item1.value as any);
                  }}
                  value={opt.value?.name ?? ''}
                  style={{
                    width: responsiveScreenWidth(100) - sizes[30],
                    marginHorizontal: sizes[10],
                  }}
                  dropdownStyle={{
                    width: responsiveScreenWidth(100) - sizes[30],
                    height: sizes[70],
                  }}
                  renderRow={(item) => {
                    return <MyText style={{}}>{item.option.value.name}</MyText>;
                  }}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
      <View
        style={{
          padding: sizes[10],
          borderTopWidth: 1,
          borderTopColor: border,
        }}>
        <MyButton onPress={handleConfirm} disabled={getDisabledBtn()}>
          показати
        </MyButton>
      </View>
    </MyModal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width,
    backgroundColor: 'white',
    position: 'absolute',
  },
  title: {
    textAlign: 'center',
    fontSize: sizes[12],
    fontFamily: getFontFamily('400'),
    paddingVertical: sizes[6],
  },
  mainText: {
    textAlign: 'center',
    fontSize: sizes[9],
    fontFamily: getFontFamily('400'),
    marginTop: sizes[10],
  },
  subText: {
    textAlign: 'center',
    fontSize: sizes[8],
    fontFamily: getFontFamily('400'),
    marginTop: sizes[6],
    marginBottom: sizes[6],
  },
});
export default ModalAssortment;
