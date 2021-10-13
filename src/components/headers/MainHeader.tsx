import {StackHeaderProps} from '@react-navigation/stack';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {sizes, useTheme} from '../../context/ThemeContext';
import {actionsCart, selectorsCart} from '../../redux/cart/cartReducer';
import {selectorsOrder, actionsOrder} from '../../redux/order/orderReducer';
import {actionsOther, selectorsOther} from '../../redux/other/otherReducer';
import {getSellPoints} from '../../redux/sellPoints/sellPointsReducer';
import {selectorsUser} from '../../redux/user/userReducer';
import useGetTranslateForDeliveryType from '../../useHooks/useGetTranslateForDeliveryType';
import {getFontFamily} from '../../utils/getFontFamily';
import t from '../../utils/translate';
import DesignIcon from '../common/DesignIcon';
import MyText from '../controls/MyText';
import ModalAssortmentWarning from '../modals/ModalAssortmentWarning';
import WrapperHeader from './WrapperHeader';

const MainHeader = ({scene}: StackHeaderProps) => {
  const dispatch = useDispatch();
  const {primary, background, lightText, text} = useTheme();
  const isAuth = useSelector(selectorsUser.isAuth);
  const sellPoints = useSelector(getSellPoints(true));
  const deliveryType = useSelector(selectorsOrder.getDeliveryType);
  const orderSellPoint = useSelector(selectorsOrder.getSellPointId);
  const selectSellPoint = sellPoints.find((s) => s.id == orderSellPoint);
  const getTextDeliveryType = useGetTranslateForDeliveryType();
  const [isOpenClearCart, setIsOpenClearCart] = useState(false);
  const isEmptyCart = useSelector(selectorsCart.isEmpty);
  const idDefaultSellPoint = useSelector(selectorsOther.getIdSellPoint);
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
  };

  const handleClearCart = () => {
    dispatch(actionsCart.clear(idDefaultSellPoint));
    dispatch(actionsCart.updateCart(idDefaultSellPoint));
    setIsOpenClearCart(false);

    dispatch(
      actionsOther.setData({
        isModalAssortment: true,
      }),
    );
  };

  return (
    <WrapperHeader
      style={{
        justifyContent: 'space-between',
      }}>
      <ModalAssortmentWarning
        modalVisible={isOpenClearCart}
        onClose={() => setIsOpenClearCart(false)}
        onConfirm={handleClearCart}
      />
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
            {t('assortmentForShort')}
          </MyText>
          <DesignIcon name={'MarkerIcon'} size={sizes[9]} fill={primary} />
          <MyText
            style={{
              marginLeft: sizes[3],
              fontFamily: getFontFamily('400'),
            }}>
            {getTextDeliveryType(deliveryType, selectSellPoint)}
          </MyText>
        </TouchableOpacity>
      )}
      {headerRight && headerRight({tintColor: text})}
    </WrapperHeader>
  );
};

export default MainHeader;
