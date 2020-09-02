import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import BlockWrapperOrder from '../../common/BlockWrapperOrder';
import MyText from '../../controls/MyText';
import {getFontFamily} from '../../../utils/getFontFamily';
import {sizes} from '../../../context/ThemeContext';
import RadioBlock from '../../controls/RadioBlock';
import {useDispatch, useSelector} from 'react-redux';
import {actionsOrder, selectorsOrder} from '../../../redux/order/orderReducer';
import {selectorsTypes} from '../../../redux/types/typeReducer';
import {TypePayment} from '../../../constants/constantsId';
import service from '../../../services/service';
import {selectorsCart} from '../../../redux/cart/cartReducer';
import {actionsOther, selectorsOther} from '../../../redux/other/otherReducer';
import {ThirdStepScreenProps} from '../../navigators/Order.navigator';
import {selectorsUser} from '../../../redux/user/userReducer';
import {formatAddress} from '../../../utils/formatAddress';

const ThirdStepScreen = React.memo(
  ({navigation, route}: ThirdStepScreenProps) => {
    const dispatch = useDispatch();
    const payments = useSelector(selectorsTypes.getPaymentsTypes);
    const payment = useSelector(selectorsOrder.getCodePayment);
    const products = useSelector(selectorsCart.getCartProducts);
    const idSellPoint = useSelector(selectorsCart.getIdSellPoint);
    const data = useSelector(selectorsOrder.getOrder);
    const draftId = useSelector(selectorsOther.getDraftId);
    const addresses = useSelector(selectorsUser.getAddresses);
    const [loading, setLoading] = useState(false);

    const options = useMemo(() => {
      return [
        {
          code: TypePayment.cash,
          title: 'Готівковий розрахунок',
        },
        {
          code: TypePayment.credit,
          title: 'Оплатити при отриманнi',
        },
        {
          code: TypePayment.online,
          title: 'Visa/MasterCard',
        },
      ];
    }, []);

    const handleContinue = async () => {
      setLoading(true);
      const address = formatAddress(
        addresses.find((a) => a.id === data.addressId)!,
      );
      await service.saveCart(products, idSellPoint);
      dispatch(
        actionsOrder.setData({
          numberOrder: draftId!,
          address,
        }),
      );
      data.address = address;
      try {
        const res = await service.createOrder(draftId!, data);
        if (res.success) {
          dispatch(
            actionsOther.setData({
              draftId: null,
            }),
          );
        }
        navigation.navigate('FinalStep', {});
      } catch (e) {}
      setLoading(false);
    };

    const handleChange = (code: TypePayment) => {
      dispatch(
        actionsOrder.setData({
          paymentType: payments.find((p) => p.code === code)!,
        }),
      );
    };

    useEffect(() => {
      dispatch(
        actionsOrder.setData({
          paymentType: payments.find((p) => p.code === TypePayment.cash)!,
        }),
      );
    }, []);

    return (
      <BlockWrapperOrder disabled={!loading} handleContinue={handleContinue}>
        <MyText style={styles.text}>Оберіть спосіб оплати</MyText>
        {options.map((o, index) => {
          return (
            <RadioBlock
              key={index}
              isActive={payment === o.code}
              onPress={() => handleChange(o.code)}
              title={o.title}
              styleCon={styles.item}
            />
          );
        })}
      </BlockWrapperOrder>
    );
  },
);

const styles = StyleSheet.create({
  text: {
    fontFamily: getFontFamily('500'),
    marginTop: sizes[5],
    marginBottom: sizes[8],
  },
  item: {
    marginBottom: sizes[6],
  },
});

export default ThirdStepScreen;
