import React, {useEffect, useState, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
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
import {getSellPoints} from '../../redux/sellPoints/sellPointsReducer';
import {selectorsTypes} from '../../redux/types/typeReducer';
import {ISellPoint} from '../../typings/FetchData';
import IOption from '../../typings/IOption';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import {getFontFamily} from '../../utils/getFontFamily';
import t from '../../utils/translate';
import DesignIcon from '../common/DesignIcon';
import CustomModalDropdown from '../controls/CustomModalDropdown';
import MyButton from '../controls/MyButton';
import MyText from '../controls/MyText';
import MyModal from './MyModal';

const COLORS = {
  background: 'background: rgba(60, 65, 98, 1)',
  text: '#FFFFFF',
  border: '#595F87',
  accent: '#6EE5FF',
  primary: '#01A6E6',
  lightText: '#A0A9BA',
};

interface IExtra {
  isActive: boolean;
  text: string;
}
const ModalAssortment = () => {
  const cities = [
    {
      label: t('citiesKyiv'),
      value: 1,
      extra: {
        isActive: true,
        text: t('citiesSuburbs'),
      },
    },
    {
      label: t('citiesLviv'),
      value: 2,
      extra: {
        isActive: false,
        text: t('citiesSuburbs'),
      },
    },
  ] as IOption<string, number, IExtra>[];
  const dispatch = useDispatch();
  const isModalAssortment = useSelector(selectorsOther.getIsModalAssortment);
  const DEFAULT_ID_SELL_POINT = useSelector(selectorsOther.getIdSellPoint);
  const deliveryTypes = useSelector(selectorsTypes.getDeliveryTypes);
  const sellPoints = useSelector(getSellPoints(false));

  const defaultDeliveryType = useSelector(selectorsOrder.getDeliveryType);
  const defaultSellPoint = useSelector(selectorsOrder.getSellPoint);

  const [deliveryType, setDeliveryType] = useState(defaultDeliveryType);
  const [sellPoint, setSellPoint] = useState(defaultSellPoint);

  const onClose = () => {
    dispatch(
      actionsOther.setData({
        isModalAssortment: false,
      }),
    );
  };

  const handleSelectDeliveryType = (type: TypeDelivery) => {
    if (type !== TypeDelivery.self) {
      setSellPoint(null);
    }
    const data = deliveryTypes.find((d) => d.code === type)!;
    setDeliveryType(data);
  };

  const handleSelectSellpoint = (data: ISellPoint) => {
    setSellPoint(data);
    handleSelectDeliveryType(TypeDelivery.self);
  };

  useEffect(() => {
    if (deliveryType) {
      if (deliveryType.code === TypeDelivery.courier) {
        actionsOrder.setData({
          sellPoint: null,
        });
      }
    }
  }, []);

  useDidUpdateEffect(() => {
    if (defaultDeliveryType === null) {
      if (sellPoint) {
        dispatch(actionsCart.updateCart(sellPoint.id));
      }
      dispatch(
        actionsOrder.setData({
          deliveryType: deliveryType,
          sellPoint: sellPoint?.id ?? null,
        }),
      );
      onClose();
    }
  }, [deliveryType]);

  const handleSelectCity = (data: number) => {
    handleSelectDeliveryType(TypeDelivery.courier);
  };

  const handleConfirm = () => {
    let id: any = DEFAULT_ID_SELL_POINT;
    if (deliveryType!.code === TypeDelivery.self) {
      id = sellPoint?.id;
    }

    dispatch(actionsCart.updateCart(id!));
    if (deliveryType!.code === TypeDelivery.courier) {
      id = null;
    }
    dispatch(
      actionsOrder.setData({
        sellPoint: id,
        deliveryType: deliveryType,
      }),
    );
    onClose();
  };

  const options = [
    {
      code: TypeDelivery.courier,
      title: `${t('btnDelivery')}`,
      options: cities,
      value:
        deliveryType?.code === TypeDelivery.courier ? cities[0].value : null,
      selected: handleSelectCity,
    },
    {
      code: TypeDelivery.self,
      title: `${t('commonSelf')}`,
      options: sellPoints.map((s) => {
        const res: IOption<string, ISellPoint, IExtra> = {
          label: s.name,
          value: s,
          extra: {
            isActive: s.isActive,
            text: s.address ?? '',
          },
        };
        return res;
      }),
      selected: handleSelectSellpoint,
      value: sellPoint,
    },
  ];

  return (
    <MyModal
      modalVisible={isModalAssortment}
      onClose={onClose}
      style={styles.modal}>
      <View style={styles.innerModal}>
        <MyText style={styles.titleModal}>
          {t('commonAssortmentExtended') + ':'}
        </MyText>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
        style={{}}>
        {options.map((opt) => {
          return <ItemTypeDelivery key={opt.code} {...opt} />;
        })}
      </ScrollView>
      {deliveryType && (
        <View style={styles.viewBtn}>
          <MyButton onPress={handleConfirm}>{t('btnShow')}</MyButton>
        </View>
      )}
    </MyModal>
  );
};

interface IItemTypeDeliveryProps<T = any> {
  code: TypeDelivery;
  title: string;
  options: IOption<string, any, IExtra>[];
  selected: (v: any) => any;
  value: any | null;
}

const ItemTypeDelivery = <T,>({
  code,
  options,
  selected,
  title,
  value,
}: IItemTypeDeliveryProps<T>) => {
  return (
    <View>
      <MyText style={styles.itemTitle}>{title}</MyText>
      {options.map((opt, i) => {
        const isActive = opt.extra ? opt.extra.isActive : false;
        const isSelected = value === opt.value;

        return (
          <TouchableOpacity
            key={i}
            onPress={() => selected(opt.value)}
            disabled={!isActive}
            containerStyle={{
              opacity: isActive ? 1 : 0.3,
            }}
            style={[
              styles.touchable,
              {
                backgroundColor: isSelected ? COLORS.primary : undefined,
              },
            ]}>
            <View>
              <MyText style={styles.text}>{opt.label}</MyText>
              <MyText
                style={{
                  color: isSelected ? COLORS.text : COLORS.lightText,
                  fontSize: sizes[8],
                }}>
                {opt.extra?.text ?? ''}
              </MyText>
            </View>
            {isSelected && (
              <View style={styles.circle}>
                <DesignIcon
                  name="check-mark"
                  fill={COLORS.primary}
                  size={sizes[7]}
                />
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  modal: {
    height: responsiveScreenHeight(80),
    borderRadius: sizes[2],
    backgroundColor: COLORS.background,
  },
  innerModal: {
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    marginHorizontal: sizes[10],
  },
  titleModal: {
    color: COLORS.text,
    fontFamily: getFontFamily('500'),
    fontSize: sizes[10],
    textAlign: 'center',
    paddingVertical: sizes[10],
  },
  contentContainerStyle: {
    paddingHorizontal: sizes[12],
  },
  viewBtn: {
    padding: sizes[10],
    paddingTop: 0,
  },
  itemTitle: {
    textAlign: 'center',
    fontFamily: getFontFamily('400'),
    fontSize: sizes[18],
    color: COLORS.accent,
    paddingVertical: sizes[5],
    paddingBottom: sizes[10],
  },
  touchable: {
    borderRadius: sizes[2],
    borderColor: 'rgba(255, 255, 255, 0.500191)',
    borderWidth: 1,
    paddingHorizontal: sizes[8],
    paddingVertical: sizes[6],
    marginBottom: sizes[5],
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  text: {
    color: COLORS.text,
    fontSize: sizes[11],
    fontFamily: getFontFamily('400'),
  },
  circle: {
    width: sizes[20],
    height: sizes[20],
    borderRadius: sizes[10],
    backgroundColor: COLORS.text,
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
  },
});
export default ModalAssortment;
