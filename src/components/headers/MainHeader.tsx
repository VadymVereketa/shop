import {StackHeaderProps} from '@react-navigation/stack';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {sizes, useTheme} from '../../context/ThemeContext';
import {selectorsCart} from '../../redux/cart/cartReducer';
import {selectorsOrder, actionsOrder} from '../../redux/order/orderReducer';
import {actionsOther} from '../../redux/other/otherReducer';
import {getSellPoints} from '../../redux/sellPoints/sellPointsReducer';
import useGetTranslateForDeliveryType from '../../useHooks/useGetTranslateForDeliveryType';
import {getFontFamily} from '../../utils/getFontFamily';
import DesignIcon from '../common/DesignIcon';
import MyText from '../controls/MyText';
import WrapperHeader from './WrapperHeader';

const MainHeader = ({scene}: StackHeaderProps) => {
  const dispatch = useDispatch();
  const {lightBackground, lightText, text} = useTheme();
  const sellPoints = useSelector(getSellPoints(true));
  const deliveryType = useSelector(selectorsOrder.getDeliveryType);
  const orderSellPoint = useSelector(selectorsOrder.getSellPointId);
  const selectSellPoint = sellPoints.find((s) => s.id == orderSellPoint);
  const getTextDeliveryType = useGetTranslateForDeliveryType();
  const [isOpenClearCart, setIsOpenClearCart] = useState(false);
  const isEmptyCart = useSelector(selectorsCart.isEmpty);
  const title = scene.descriptor.options.title || '';

  const {headerRight} = scene.descriptor.options;

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

  return (
    <WrapperHeader
      style={{
        justifyContent: 'space-between',
      }}>
      <DesignIcon name="logo" size={sizes[20]} fill="white" />
      {deliveryType && (
        <TouchableOpacity
          onPress={handleOpenAssortmentModal}
          containerStyle={{
            overflow: 'hidden',
            flexGrow: 1,
            alignItems: 'center',
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: sizes[5],
            paddingHorizontal: sizes[7],
            marginHorizontal: sizes[1],
          }}>
          <MyText
            style={{
              color: lightText,
              marginRight: sizes[3],
            }}>
            Асорт. для
          </MyText>
          <MyText
            style={{
              marginRight: sizes[3],
              fontFamily: getFontFamily('400'),
            }}>
            {getTextDeliveryType(deliveryType, selectSellPoint)}
            {'   '}
            <DesignIcon name={'arrow-down'} size={sizes[5]} fill={text} />
          </MyText>
        </TouchableOpacity>
      )}
      {headerRight && headerRight({tintColor: text})}
    </WrapperHeader>
  );
};

export default MainHeader;
